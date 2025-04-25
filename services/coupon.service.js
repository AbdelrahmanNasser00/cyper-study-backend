const { Op } = require("sequelize");

class CouponService {
  constructor(Coupon, AppErrors) {
    this.Coupon = Coupon;
    this.AppErrors = AppErrors;
  }

  async validateCoupon(code, courseId) {
    const coupon = await this.Coupon.findOne({
      where: {
        code,
        courseId,
        expiresAt: {
          [Op.gt]: new Date(), 
        },
        [Op.or]: [
          { usageLimit: null },
          this.Coupon.sequelize.literal("usageLimit > timesUsed"),
        ],
      },
    });
    if (!coupon) {
      throw new this.AppErrors("Invalid or expired coupon", 400);
    }
    return coupon;
  }

  async incrementCouponUsage(code) {
    await this.Coupon.increment("times_used", {
      by: 1,
      where: { code },
    });
  }

  async createCoupon(data) {
    const existingCoupon = await this.Coupon.findOne({
      where: { code: data.code, courseId: data.courseId },
    });
    if (existingCoupon) {
      throw new this.AppErrors("Coupon with this code already exists for this course", 400);
    }
    // Create the coupon if it doesn't exist
    const coupon = await this.Coupon.create({
      ...data,
    });

    return coupon;
  }

  async applyCoupon(code, coursePrice, courseId) {
    // Validate the coupon
    const coupon = await this.validateCoupon(code, courseId);
    if (!coupon) {
      throw new this.AppErrors("Invalid or expired coupon", 400);
    }

    let discount = 0;
    if (coupon.discount) {
      discount = (coursePrice * coupon.discount) / 100;
    }

    discount = Math.min(discount, coursePrice);

    const finalPrice = coursePrice - discount;

    return {
      originalPrice: coursePrice,
      discount,
      finalPrice,
      couponCode: code,
    };
  }

  async getAllCoupons(courseId = null, limit = 10, offset = 0) {
    // Filter by courseId if provided
    const whereClause = courseId ? { courseId } : {};

    // Fetch all coupons with pagination
    const coupons = await this.Coupon.findAll({ where: whereClause, limit, offset });
    if (!coupons) {
      throw new this.AppErrors("No coupons found", 404);
    }
    return coupons;
  }

  async deleteCoupon(id) {
    const coupon = await this.Coupon.destroy({ where: { id } });
    if (!coupon) {
      throw new this.AppErrors("Coupon not found", 404);
    }
    return coupon;
  }

  async updateCoupon(id, data) {
    // Find the coupon by ID
    const coupon = await this.Coupon.findByPk(id);
    if (!coupon) {
      throw new this.AppErrors("Coupon not found", 404);
    }

    // Update the coupon with the provided data
    await coupon.update(data);

    return coupon;
  }
}

module.exports = CouponService;
