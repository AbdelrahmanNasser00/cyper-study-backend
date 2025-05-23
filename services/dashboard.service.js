const { Op, Sequelize } = require("sequelize");

class DashboardService {
  constructor(
    Enrollment,
    Course,
    Certificate,
    Review,
    Earning,
    AppErrors,
    User
  ) {
    this.Enrollment = Enrollment;
    this.Course = Course;
    this.Certificate = Certificate;
    this.Review = Review;
    this.Earning = Earning;
    this.AppErrors = AppErrors;
    this.User = User;
  }
  async summary(instructorId) {
    try {
      // Get all courses for the instructor
      const courses = await this.Course.findAll({
        where: { instructorId },
        attributes: ["id"],
      });
      const courseIds = courses.map((c) => c.id);

      // Total students enrolled in instructor's courses
      const totalStudents = await this.Enrollment.count({
        where: { courseId: courseIds.length ? courseIds : null },
      });

      // Total certificates issued for instructor's courses
      const totalCertificates = await this.Certificate.count({
        where: { courseId: courseIds.length ? courseIds : null },
      });

      // Total reviews for instructor's courses
      const totalReviews = await this.Review.count({
        where: { courseId: courseIds.length ? courseIds : null },
      });

      // Total earnings for instructor
      const totalEarnings = await this.Earning.sum("totalEarnings", {
        where: { instructorId },
      });

      return {
        totalCourses: courses.length,
        totalStudents,
        totalCertificates,
        totalReviews,
        totalEarnings: parseFloat(totalEarnings || 0).toFixed(2),
      };
    } catch (error) {
      throw new this.AppErrors("Failed to fetch dashboard summary", 500);
    }
  }

  //getCoursePerformance
  async getCoursePerformance(courseId) {
    try {
      // Fetch total earnings for the course
      const totalEarnings = await this.Earning.sum("totalEarnings", {
        where: { courseId },
      });
    

      // Fetch total students enrolled in the course
      const totalStudents = await this.Enrollment.count({
        where: { courseId },
      });
  
      // Fetch total reviews for the course
      const totalReviews = await this.Review.count({
        where: { courseId },
      });
    
      // Fetch total certificates issued for the course
      const totalCertificates = await this.Certificate.count({
        where: { courseId },
      });
 
      // Fetch students and their progress for the course
      const studentsProgress = await this.Enrollment.findAll({
        where: { courseId },
        include: [
          {
            model: this.User,
            attributes: ["id", "firstname", "lastname", "email"],
          },
        ],
        attributes: ["progress", "createdAt"],
      });

      // Format the students' progress data
      const formattedStudentsProgress = studentsProgress.map((enrollment) => ({
        studentId: enrollment.User?.id,
        studentName: enrollment.User
          ? `${enrollment.User.firstname} ${enrollment.User.lastname}`
          : "",
        studentEmail: enrollment.User?.email,
        progress: enrollment.progress,
        enrolledAt: enrollment.createdAt,
      }));

      return {
        totalEarnings: parseFloat(totalEarnings || 0).toFixed(2),
        totalStudents,
        totalReviews,
        totalCertificates,
        studentsProgress: formattedStudentsProgress,
      };
    } catch (error) {
      throw new this.AppErrors("Failed to fetch course performance", 500);
    }
  }
  async getRatingsSummary(instructorId) {
    const courses = await this.Course.findAll({
      where: { instructorId },
      attributes: ["id", "averageRating"],
    });

    const ratings = courses.map((c) => c.rating || 0);
    const averageRating = ratings.length
      ? (ratings.reduce((a, b) => a + b) / ratings.length).toFixed(2)
      : 0;

    return averageRating;
  }
  async getMonthlyEarningsBreakdown(instructorId) {
    try {
      // Query the Earnings table and group by month and year
      const monthlyEarnings = await this.Earning.findAll({
        where: { instructorId },
        attributes: [
          [Sequelize.fn("YEAR", Sequelize.col("createdAt")), "year"], // Extract year
          [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"], // Extract month
          [
            Sequelize.fn("SUM", Sequelize.col("totalEarnings")),
            "totalEarnings",
          ], // Sum earnings
        ],
        group: ["year", "month"], // Group by year and month
        order: [
          ["year", "DESC"],
          ["month", "DESC"],
        ], // Order by year and month
        raw: true, // Return raw data
      });

      // Format the result for better readability
      const formattedEarnings = monthlyEarnings.map((earning) => ({
        year: earning.year,
        month: earning.month,
        totalEarnings: parseFloat(earning.totalEarnings).toFixed(2),
      }));

      return formattedEarnings;
    } catch (error) {
      console.error("Error in getMonthlyEarningsBreakdown:", error.message);
      throw new this.AppErrors(
        "Failed to fetch monthly earnings breakdown",
        500
      );
    }
  }
}

module.exports = DashboardService;
