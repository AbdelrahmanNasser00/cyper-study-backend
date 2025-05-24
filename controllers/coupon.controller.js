class CouponController {
  constructor(couponService) {
    this.couponService = couponService;
  }

  // Create a new coupon
  createCoupon = async (req, res, next) => {
    try {
      const couponData = req.body;
      const userId = req.user.id;
      const coupon = await this.couponService.createCoupon(couponData, userId);
      res.status(201).json(coupon);
    } catch (err) {
      next(err);
    }
  };

  // Apply a coupon
  applyCoupon = async (req, res, next) => {
    try {
      const { code, coursePrice, courseId } = req.body;
      const result = await this.couponService.applyCoupon(
        code,
        coursePrice,
        courseId
      );
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // Get all coupons
  getAllCoupons = async (req, res, next) => {
    try {
      const { courseId } = req.query;
      const instructorId = req.user.id;
      const { page = 1, limit = 10 } = req.query; // Pagination
      const offset = (page - 1) * limit;

      const coupons = await this.couponService.getAllCoupons(
        courseId,
        instructorId,
        limit,
        offset
      );
      res.status(200).json(coupons);
    } catch (err) {
      next(err);
    }
  };

  // Delete a coupon
  deleteCoupon = async (req, res, next) => {
    try {
      const { id } = req.params;

      await this.couponService.deleteCoupon(id);
      res.status(204).json({
        message: "Coupon deleted successfully.",
      });
    } catch (err) {
      next(err);
    }
  };

  // Validate a coupon
  validateCoupon = async (req, res, next) => {
    try {
      const { code, courseId } = req.query;
      const coupon = await this.couponService.validateCoupon(code, courseId);

      res.status(200).json(coupon);
    } catch (err) {
      next(err);
    }
  };

  // Update a coupon
  updateCoupon = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedCoupon = await this.couponService.updateCoupon(id, req.body);
      res.status(200).json(updatedCoupon);
    } catch (err) {
      next(err);
    }
  };

  // Get a coupon by ID
  getCouponById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const instructorId = req.user.id;
      const coupon = await this.couponService.getCouponById(id, instructorId);
      res.status(200).json(coupon);
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CouponController;
