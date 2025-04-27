class AuthService {
  constructor(UserModel, passwordUtils, tokenUtils, AppErrors, EmailService) {
    this.UserModel = UserModel;
    this.passwordUtils = passwordUtils;
    this.tokenUtils = tokenUtils;
    this.AppErrors = AppErrors;
    this.EmailService = EmailService;
  }
  async login({ email, password }) {
    const user = await this.UserModel.findOne({ where: { email } });
    if (
      !user ||
      !(await this.passwordUtils.comparePasswords(password, user.password))
    ) {
      throw new this.AppErrors("Invalid email or password", 401);
    }

    const token = await this.tokenUtils.generateToken(user);

    return { token, role: user.role };
  }
  async register({
    firstname,
    lastname,
    email,
    password,
    confirmPassword,
    role,
    bio,
    profilePicture,
  }) {
    if (password !== confirmPassword) {
      throw new this.AppErrors("Passwords do not match", 400);
    }

    const existingUser = await this.UserModel.findOne({
      where: { email: email.toLowerCase() },
    });
    if (existingUser) {
      throw new this.AppErrors("User already exists", 409);
    }
    const hashedPassword = await this.passwordUtils.hashPassword(password);

    const user = await this.UserModel.create({
      firstname,
      lastname,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      ...(bio && { bio }),
      ...(profilePicture && { profilePicture }),
    });

    const { password: _, ...userWithoutPassword } = user.toJSON();
    return userWithoutPassword;
  }

  async forgotPassword(email) {
    const user = await this.UserModel.findOne({ where: { email } });
    if (!user) {
      throw new this.AppErrors("User with this email does not exist", 404);
    }

    // Generate a reset token
    const resetToken = await this.tokenUtils.generateToken(
      user,
      "15m",
      "reset_password"
    );

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    await this.EmailService.sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetLink}`,
    });

    return { message: "Password reset email sent successfully" };
  }

  async resetPassword(token, newPassword, confirmPassword) {
    if (newPassword !== confirmPassword) {
      throw new this.AppErrors("Passwords do not match", 400);
    }

    // Verify the reset token
    const payload = await this.tokenUtils.verifyToken(token);
    if (payload.purpose !== "reset_password") {
      throw new this.AppErrors("Invalid or expired token", 400);
    }
    const user = await this.UserModel.findByPk(payload.id);
    if (!user) {
      throw new this.AppErrors("Invalid or expired token", 400);
    }

    const hashedPassword = await this.passwordUtils.hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    return { message: "Password reset successfully" };
  }
}

module.exports = AuthService;
