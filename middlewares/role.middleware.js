const AppErrors = require("../utils/AppErrors");

const authorize = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      throw new AppErrors("Unauthorized access", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppErrors("You are not allowed to access this resource", 403);
    }

    next();
  };
};

module.exports = authorize;
