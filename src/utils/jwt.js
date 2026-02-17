const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpires } = require("../config/env");

exports.generateToken = (payload) => {
  return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, jwtSecret);
};