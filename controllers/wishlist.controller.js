class WishlistController {
  constructor(wishlistService) {
    this.wishlistService = wishlistService;
  }
  getWishlist = async (req, res, next) => {
    try {
      const wishlist = await this.wishlistService.getWishlist(req.user.id);
      res.status(200).json(wishlist);
    } catch (err) {
      next(err);
    }
  };

  addCourseToWishlist = async (req, res, next) => {
    try {
      const wishlist = await this.wishlistService.addCourseToWishlist(
        req.user.id,
        req.body.courseId
      );
      res
        .status(201)
        .json({ message: "Course added to wishlist successfully", wishlist });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  removeCourseFromWishlist = async (req, res, next) => {
    try {
      const wishlist = await this.wishlistService.removeCourseFromWishlist(
        req.user.id,
        req.params.id
      );
      res.status(200).json({
        message: "Course removed from wishlist successfully",
        wishlist,
      });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = WishlistController;
