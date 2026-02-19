const authService = require("./auth.service");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const tenant = req.tenant; // From tenant middleware

    const result = await authService.login(email, password, tenant);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};