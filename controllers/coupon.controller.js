class CouponController {
  constructor(couponService) {
    this.couponService = couponService;
  }

  // Create a new coupon
  createCoupon = async (req, res, next) => {
    try {
      const couponData = req.body;
      const coupon = await this.couponService.createCoupon(couponData);
      res.status(201).json({
        message: "Coupon created successfully.",
        coupon,
      });
    } catch (err) {
      next(err);
    }
  };

  // Apply a coupon
  applyCoupon = async (req, res, next) => {
    try {
      const { code, coursePrice, courseId } = req.body;
      const result = await this.couponService.applyCoupon(code, coursePrice, courseId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  // Get all coupons
  getAllCoupons = async (req, res, next) => {
    try {
      const { courseId } = req.query; 
      const { page = 1, limit = 10 } = req.query; // Pagination
      const offset = (page - 1) * limit;

      const coupons = await this.couponService.getAllCoupons(courseId, limit, offset);
      res.status(200).json({
        message: "Coupons retrieved successfully.",
        coupons,
      });
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

      res.status(200).json({
        message: "Coupon is valid.",
        coupon,
      });
    } catch (err) {
      next(err);
    }
  };

  // Update a coupon
  updateCoupon = async (req, res, next) => {
    try {
      const { id } = req.params;
      const updatedCoupon = await this.couponService.updateCoupon(id, req.body);
      res.status(200).json({
        message: "Coupon updated successfully.",
        updatedCoupon,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = CouponController;