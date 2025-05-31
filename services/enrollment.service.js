const sequelize = require("../config/database");

class EnrollmentService {
  constructor(
    Enrollment,
    Course,
    CouponService,
    AppErrors,
    paymentFactory,
    Order,
    OrderItem,
    Earning,
    CartItems,
    Cart
  ) {
    this.enrollment = Enrollment;
    this.course = Course;
    this.CouponService = CouponService;
    this.AppErrors = AppErrors;
    this.paymentFactory = paymentFactory;
    this.order = Order;
    this.orderItem = OrderItem;
    this.earning = Earning;
    this.cartItems = CartItems;
    this.cart = Cart;
  }
  // Get all enrollments for a user
  async getAllEnrollments(userId) {
    const enrollments = await this.enrollment.findAll({
      where: { userId },
      include: [
        {
          model: this.course,
          attributes: ["id", "title", "price"],
        },
      ],
    });
    if (!enrollments) {
      throw new this.AppErrors("No enrollments found", 404);
    }
    return enrollments;
  }

  async enroll(userId, courseIds, coupons, provider) {
    const paymentService = this.paymentFactory.getPaymentService(provider);

    return await sequelize.transaction(async (t) => {
      // 1. Prevent duplicate enrollments
      const alreadyEnrolled = await this.enrollment.findAll({
        where: { userId, courseId: courseIds },
        transaction: t,
      });
      if (alreadyEnrolled.length > 0) {
        throw new this.AppErrors(
          "User is already enrolled in one or more selected courses.",
          400
        );
      }

      // 2. Fetch all courses
      const courses = await this.course.findAll({
        where: { id: courseIds },
        transaction: t,
      });
      if (courses.length !== courseIds.length) {
        throw new this.AppErrors("One or more courses not found", 404);
      }

      // 3. Calculate total price (apply coupon if needed)
      let totalPrice = 0;
      const coursePrices = {};
      for (const course of courses) {
        let price = Number(course.price);

        let couponCode = null;
        if (Array.isArray(coupons)) {
          const found = coupons.find((c) => c.courseId == course.id);
          couponCode = found ? found.couponCode : null;
        } else if (typeof coupons === "object" && coupons !== null) {
          couponCode = coupons[course.id];
        }

        if (couponCode) {
          const coupon = await this.CouponService.validateCoupon(
            couponCode,
            course.id
          );
          if (coupon && coupon.discount) {
            price = price - (price * coupon.discount) / 100;
          }
        }

        price = Number(price.toFixed(2));
        coursePrices[course.id] = price;
        totalPrice += price;
      }
      totalPrice = Number(totalPrice.toFixed(2));

      // 4. Create the order
      const order = await this.order.create(
        {
          userId,
          totalAmount: totalPrice,
          status: "pending",
          provider: provider,
        },
        { transaction: t }
      );

      // 5. Create order items and enrollments
      for (const courseId of courseIds) {
        await this.orderItem.create(
          {
            orderId: order.id,
            courseId,
            price: coursePrices[courseId],
          },
          { transaction: t }
        );
      }

      // 6. Payment
      const { approvalUrl, Token } = await paymentService.createOrder(
        totalPrice,
        order.id
      );
      order.paymentToken = Token;
      await order.save({ transaction: t });

      return {
        message: "Order created",
        approvalUrl,
        orderId: order.id,
      };
    });
  }

  async completeOrder(token) {
    const order = await this.order.findOne({
      where: { paymentToken: token },
    });

    if (!order) {
      throw new this.AppErrors("Order not found", 404);
    }

    const paymentService = this.paymentFactory.getPaymentService(
      order.provider
    );

    return await sequelize.transaction(async (t) => {
      const paymentResult = await paymentService.capturePayment(token);

      if (paymentResult.status !== "COMPLETED") {
        throw new this.AppErrors("Payment not completed.", 400);
      }

      // Mark the order as paid
      order.status = "paid";
      await order.save({ transaction: t });

      // Get all order items for this order
      const orderItems = await this.orderItem.findAll({
        where: { orderId: order.id },
        transaction: t,
      });

      for (const item of orderItems) {
        // Create the enrollment for each course
        await this.enrollment.create(
          {
            userId: order.userId,
            courseId: item.courseId,
            progress: 0,
          },
          { transaction: t }
        );

        // Fetch the course to get the instructor ID
        const course = await this.course.findByPk(item.courseId, {
          attributes: ["id", "instructorId"],
          transaction: t,
        });

        if (!course) {
          throw new this.AppErrors("Course not found", 404);
        }

        // Calculate the instructor's earnings (e.g., 80% of the course price)
        const instructorEarnings = item.price * 0.8;

        // Update or create the earning record for the instructor
        const [earning] = await this.earning.findOrCreate({
          where: {
            instructorId: course.instructorId,
            courseId: course.id,
          },
          defaults: {
            instructorId: course.instructorId,
            courseId: course.id,
            totalEarnings: instructorEarnings,
          },
          transaction: t,
        });

        if (!earning.isNewRecord) {
          // If the earning record already exists, update it
          earning.totalEarnings += instructorEarnings;
          await earning.save({ transaction: t });
        }
      }

      // Clear cart items for the enrolled courses
      await this.cartItems.destroy({
        where: { courseId: orderItems.map((item) => item.courseId) },
        transaction: t,
      });

      const userCart = await this.cart.findOne({
        where: { userId: order.userId },
        transaction: t,
      });
      if (userCart) {
        await this.cartItems.destroy({
          where: { cartId: userCart.id },
          transaction: t,
        });
      }
      // Clear the user's cart
      await this.cart.destroy({
        where: { userId: order.userId },
        transaction: t,
      });

      return paymentResult;
    });
  }
}

module.exports = EnrollmentService;
