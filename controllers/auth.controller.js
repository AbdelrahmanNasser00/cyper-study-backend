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
}

module.exports = AuthController;
