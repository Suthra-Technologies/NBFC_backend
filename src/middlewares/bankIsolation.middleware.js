module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Super Admin bypass
  if (req.user.role === "SUPER_ADMIN") {
    return next();
  }

  // Attach bankId for downstream filtering
  req.bankFilter = { bankId: req.user.bankId };

  next();
};