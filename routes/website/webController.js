const { validationResult } = require("express-validator");
const Website = require("../../models/Website");

module.exports = class authController {
  async getAll(req, res) {
    try {
      const websites = await Website.find({}, "title url isAccessible");
      res.status(200).json({ websites });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }
  async create(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { title, url } = req.body;
      const website = new Website({
        title: title,
        url: url,
      });
      await website.save();
      res.status(200).json({ succes: true });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }
};
