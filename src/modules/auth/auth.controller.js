const authService = require("./auth.service");

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await authService.login(email, password);

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    next(err);
  }
};