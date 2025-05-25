const bcrypt = require("bcrypt");
class ProfileService {
  constructor(User,Course,Enrollment,AppErrors) {
    this.User = User;
    this.Course = Course;
    this.Enrollment = Enrollment;
    this.AppErrors = AppErrors;
  }

  async getProfile(userId) {
    const user = await this.User.findByPk(userId, {
      attributes: ["id", "firstname", "lastname", "email", "bio", "profilePicture", "role"],
    });
    if (!user) throw new this.AppErrors("User not found", 404);

    // Only calculate stats for instructors
    let stats = {};
    if (user.role === "instructor") {
      const Course = this.Course;
      const Enrollment = this.Enrollment;

      // Get all courses for this instructor
      const courses = await Course.findAll({ where: { instructorId: userId } });
      const courseIds = courses.map(c => c.id);

      // Average rating
      const ratings = courses.map(c => Number(c.averageRating)).filter(r => !isNaN(r));
      const avgRating = ratings.length > 0
        ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(2)
        : 0;

      // Number of students (unique)
      let studentsCount = 0;
      if (courseIds.length > 0) {
        studentsCount = await Enrollment.count({
          where: { courseId: courseIds },
          distinct: true,
          col: "userId",
        });
      }

      stats = {
        averageRating: avgRating,
        coursesCount: courses.length,
        studentsCount,
      };
    }

    return { ...user.toJSON(), ...stats };
  }

  async updateProfile(userId, updates) {
    const user = await this.User.findByPk(userId);
    if (!user) throw new this.AppErrors("User not found",404);

    await user.update(updates);

    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      bio: user.bio,
      profilePicture: user.profilePicture,
      role: user.role,
    };
  }

  async updatePassword(userId, currentPassword, newPassword) {
    const user = await this.User.findByPk(userId);
    if (!user) throw new this.AppErrors("User not found",404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) throw new this.AppErrors("Current password is incorrect",401);

    const hashed = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashed });
    return { message: "Password updated successfully" };
  }

  async updateProfilePicture(userId, profilePicture) {
    const user = await this.User.findByPk(userId);
    if (!user) throw this.AppErrors("User not found",404);

    await user.update({ profilePicture });
    return  profilePicture ;
  }
}

module.exports = ProfileService;
