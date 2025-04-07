const jwt = require("jsonwebtoken");
const tokenKey = process.env.TOKEN_KEY;

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    tokenKey,
    { expiresIn: "24h" }
  );
};

module.exports = { generateToken };
