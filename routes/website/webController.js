const { validationResult } = require("express-validator");

const Website = require("../../models/Website");
const Comment = require("../../models/Comment");

module.exports = class authController {
  async getAll(req, res) {
    try {
      const response = [];
      const websites = await Website.find({}, "title url isAccessible");
      for (const website of websites) {
        const comments = await Comment.find({
          websiteId: website._id,
          verified: true,
        });
        const obj = {
          _id: website._id,
          title: website.title,
          url: website.url,
          isAccessible: website.isAccessible,
          rating: website.ratingCount
            ? website.rating / website.ratingCount
            : 0,
          comments: comments,
        };
        response.push(obj);
      }
      res.status(200).json({ websites: response });
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
