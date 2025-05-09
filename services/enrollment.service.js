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
    Earning
  ) {
    this.enrollment = Enrollment;
    this.course = Course;
    this.CouponService = CouponService;
    this.AppErrors = AppErrors;
    this.paymentFactory = paymentFactory;
    this.order = Order;
    this.orderItem = OrderItem;
    this.earning = Earning;
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

  async enroll(userId, courseId, couponCode, provider) {
    const paymentService = this.paymentFactory.getPaymentService(provider);

    return await sequelize.transaction(async (t) => {
      const alreadyEnrolled = await this.enrollment.findOne({
        where: { userId, courseId },
        transaction: t,
      });

      if (alreadyEnrolled) {
        throw new this.AppErrors(
          "User is already enrolled in this course.",
          400
        );
      }

      const course = await this.course.findByPk(courseId, { transaction: t });
      if (!course) {
        throw new this.AppErrors("Course not found", 404);
      }

      let finalPrice = course.price;

      if (couponCode) {
        const coupon = await this.CouponService.validateCoupon(
          couponCode,
          courseId
        );
        if (coupon.discount) {
          finalPrice = finalPrice - (finalPrice * coupon.discount) / 100;
        }
      }

      const order = await this.order.create(
        {
          userId,
          totalAmount: finalPrice,
          status: "pending",
          provider: provider,
        },
        { transaction: t }
      );

      await this.orderItem.create(
        {
          orderId: order.id,
          courseId,
          price: finalPrice,
        },
        { transaction: t }
      );

      const { approvalUrl, Token } = await paymentService.createOrder(
        finalPrice,
        order.id,
        
      );

      order.paymentToken =Token;
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

      // Get the order item
      const orderItem = await this.orderItem.findOne({
        where: { orderId: order.id },
        transaction: t,
      });

      // Create the enrollment
      const enrollmentData = {
        userId: order.userId,
        courseId: orderItem.courseId,
      };

      await this.enrollment.create(enrollmentData, { transaction: t });

      // Fetch the course to get the instructor ID
      const course = await this.course.findByPk(orderItem.courseId, {
        attributes: ["id", "instructorId"],
        transaction: t,
      });

      if (!course) {
        throw new this.AppErrors("Course not found", 404);
      }

      // Calculate the instructor's earnings (e.g., 80% of the course price)
      const instructorEarnings = orderItem.price * 0.8;

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

      return paymentResult;
    });
  }
}

module.exports = EnrollmentService;
