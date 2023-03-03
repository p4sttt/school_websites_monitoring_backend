const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

module.exports = class authController {
  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { email, name, password } = req.body;
      const candidate = await User.findOne({ email: email });
      if (candidate) {
        return res.status(400).json({ message: "Пользователь уже существует" });
      }
      const hashPassword = bcrypt.hashSync(password, 7);
      const user = new User({
        name: name,
        email: email,
        password: hashPassword,
      });
      await user.save();
      const id = user._id;
      const userName = user.name;
      const token = jwt.sign({ name: userName, id: id }, process.env.JWT_KEY, {
        expiresIn: "48h",
      });
      return res.status(200).json({ token: token, name: userName });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: "Ошибка валидации" });
      }
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(400).json({ message: "Пользователь не найден" });
      }
      const userPassword = user.password;
      const validPassword = bcrypt.compareSync(password, userPassword);
      if (!validPassword) {
        res.status(400).json({ message: "Неверный логин или пароль" });
      }
      const id = user._id;
      const userName = user.name;
      const token = jwt.sign({ name: userName, id: id }, process.env.JWT_KEY, {
        expiresIn: "48h",
      });
      return res.status(200).json({ token: token, name: userName });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Что-то пошло не так :(" });
    }
  }
};
