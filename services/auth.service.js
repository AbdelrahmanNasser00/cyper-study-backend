class AuthService {
  constructor(UserModel, passwordUtils, tokenUtils, AppErrors) {
    this.UserModel = UserModel;
    this.passwordUtils = passwordUtils;
    this.tokenUtils = tokenUtils;
    this.AppErrors = AppErrors;
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
}

module.exports = AuthService;
