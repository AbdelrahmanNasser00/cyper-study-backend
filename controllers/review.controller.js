class ReviewController {
  constructor(reviewService) {
    this.reviewService = reviewService;
  }

  addReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.addReview(req.user.id, req.body);
      res.status(201).json({ message: "Review added successfully", review });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  getReviews = async (req, res, next) => {
    try {
      const reviews = await this.reviewService.getReviews(req.params.id);
      res.status(200).json(reviews);
    } catch (err) {
      next(err);
    }
  };

  updateReview = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
      const review = await this.reviewService.updateReview(
        userId,
        id,
        req.body
      );
      res.status(200).json({ message: "Review updated successfully", review });
    } catch (err) {
      next(err);
    }
  };
  deleteReview = async (req, res, next) => {
    try {
      const review = await this.reviewService.deleteReview(
        req.user.id,
        req.params.id
      );
      res.status(200).json({ message: "Review deleted successfully", review });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ReviewController;
