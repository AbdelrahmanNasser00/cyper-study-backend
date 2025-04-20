class WishlistService {
  constructor(WishlistModel, CourseModel, AppErrors) {
    this.WishlistModel = WishlistModel;
    this.CourseModel = CourseModel;
    this.AppErrors = AppErrors;
  }

  async getWishlist(userId) {
    const wishlist = await this.WishlistModel.findAll({
      where: { userId },
    });

    return wishlist;
  }

  async addCourseToWishlist(userId, courseId) {
    const course = await this.CourseModel.findByPk(courseId);
    if (!course) {
      throw new this.AppErrors.NotFoundError("Course not found");
    }

    const existing = await this.WishlistModel.findOne({
      where: { userId, courseId },
    });
    if (existing) throw new this.AppErrors("Course already in wishlist", 400);

    const wishlistItem = await this.WishlistModel.create({ userId, courseId });
    return wishlistItem;
  }

  async removeCourseFromWishlist(userId, courseId) {
    const wishlist = await this.WishlistModel.destroy({
      where: { userId, courseId },
    });
    return wishlist;
  }
}
module.exports = WishlistService;
