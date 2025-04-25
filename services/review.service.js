class ReviewService {
  constructor(ReviewModel, UserModel, AppErrors) {
    this.ReviewModel = ReviewModel;
    this.UserModel = UserModel;
    this.AppErrors = AppErrors;
  }

  async addReview(userId, reviewData) {
    let review = await this.ReviewModel.findOne({
      where: { userId, courseId: reviewData.courseId },
    });
    if (review) {
      throw new this.AppErrors("Review already exists", 400);
    }
    review = await this.ReviewModel.create({
      userId,
      ...reviewData,
    });

    return review;
  }

  async getReviews(courseId) {
    const reviews = await this.ReviewModel.findAll({
      where: { courseId },
      attributes: [
        "id",
        "userId",
        "courseId",
        "rating",
        "comment",
        "createdAt",
        "updatedAt",
      ],
      include: [
        {
          model: this.UserModel,
          attributes: ["id", "firstname", "lastname", "profilePicture"],
        },
      ],
    });

    return reviews;
  }

  async updateReview(userId, reviewId, reviewData) {
    const review = await this.ReviewModel.findOne({
      where: {
        id: reviewId,
        userId: userId,
      },
    });
    if (!review) throw new this.AppErrors("Review not found", 404);
    await review.update(reviewData);
    return review;
  }

  async deleteReview(userId, reviewId) {
    const review = await this.ReviewModel.findOne({
      where: {
        id: reviewId,
        userId: userId,
      },
    });
    if (!review) throw new this.AppErrors("Review not found", 404);
    await review.destroy();
    return review;
  }
}

module.exports = ReviewService;
