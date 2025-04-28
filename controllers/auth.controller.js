class AuthController {
  constructor(authService) {
    this.authService = authService;
  }

  login = async (req, res, next) => {
    try {
      const user = await this.authService.login(req.body);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  register = async (req, res, next) => {
    try {
      const user = await this.authService.register(req.body);
      res.status(201).json(user);
    } catch (error) {
      console.error("Registration error:", error);
      next(error);
    }
  };
  forgotPassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await this.authService.forgotPassword(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword, confirmPassword } = req.body;
      const result = await this.authService.resetPassword(
        token,
        newPassword,
        confirmPassword
      );
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = AuthController;
