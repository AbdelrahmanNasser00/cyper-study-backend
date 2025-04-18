const jwt = require("jsonwebtoken");
const { User } = require("../models");
const AppErrors = require("../utils/AppErrors");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppErrors("Authentication token is missing", 401);
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new AppErrors("User not found", 401);
    }

    req.user = user; 
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = authenticate;
