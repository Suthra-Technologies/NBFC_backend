module.exports = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Super Admin bypass
  if (req.user.role === "SUPER_ADMIN") {
    return next();
  }

  // Context Validation: If accessed via a subdomain, it must match the user's bank
  if (req.tenant && req.user.bankId.toString() !== req.tenant._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Security Error: Token not valid for this bank portal"
    });
  }

  // Attach bankId for downstream filtering
  req.bankFilter = { bankId: req.user.bankId };

  next();
};