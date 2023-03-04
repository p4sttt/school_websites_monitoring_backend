const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(403).json({ message: "Пользователь не авторизован" });
    }
    const { isAdmin } = jwt.verify(token, process.env.JWT_KEY);
    if (!isAdmin) {
      return res
        .status(403)
        .json({ message: "Пользователь не имеет прав администратора" });
    } else {
      next();
    }
  } catch (error) {
    return res.status(403).json({ message: "Пользователь не авторизован" });
  }
};
