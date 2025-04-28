const jwt = require("jsonwebtoken");
const tokenKey = process.env.TOKEN_KEY;

const generateToken = (user, expiresIn = "30d", purpose = "auth") => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      purpose,
    },
    tokenKey,
    { expiresIn }
  );
};

const generateRefreshToken = (user, expiresIn = "7d") => {
  return generateToken(user, expiresIn, "refresh");
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, tokenKey);
  } catch (err) {
     next(err);
  }
};

module.exports = { generateToken, generateRefreshToken, verifyToken };
