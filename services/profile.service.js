const bcrypt = require("bcrypt");
class ProfileService {
  constructor(User,AppErrors) {
    this.User = User;
    this.AppErrors = AppErrors;
  }

  async getProfile(userId) {
    const user = await this.User.findByPk(userId, {
      attributes: ["id", "firstname", "lastname", "email", "bio", "profilePicture", "role"],
    });
    if (!user) throw new this.AppErrors("User not found",404);
    return user;
  }

  async updateProfile(userId, updates) {
    const user = await this.User.findByPk(userId);
    if (!user) throw new this.AppErrors("User not found",404);

    await user.update(updates);
    return user;
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
