const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const Request = require("../../models/Request");
const Website = require("../../models/Website");
const Comment = require("../../models/Comment");

module.exports = class userController {
  async addRequest(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { title, url } = req.body;
      const { token } = req.headers;
      const websiteTitle = await Website.findOne({ title });
      const websiteURL = await Website.findOne({ url });
      const requestTitle = await Request.findOne({ title });
      const requestURL = await Request.findOne({ url });
      if (websiteTitle || websiteURL || requestTitle || requestURL) {
        return res
          .status(400)
          .json({ message: "Заявка или сайт с такими данными уже существует" });
      }
      const { id } = jwt.decode(token);
      const request = new Request({
        title: title,
        url: url,
        from: id,
      });
      await request.save();
      res.status(200).json({ sucess: true });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
      console.log(error);
    }
  }
  async addComment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { text, websiteId } = req.body;
      const { token } = req.headers;
      const { id } = jwt.decode(token);
      const existComment = await Comment.findOne({ from: id });
      if (existComment) {
        return res.status(400).json({ message: "Вы уже оставили комментарий" });
      }
      const comment = new Comment({
        from: id,
        text: text,
        websiteId: websiteId,
      });
      await comment.save();
      res.status(200).json({ sucess: true });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }
  async addRating(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors });
      }
      const { rating, websiteId } = req.body;
      const { token } = req.headers;
      const { id } = jwt.decode(token);
      const website = await Website.findById(websiteId);
      if (website.ratingCount.includes(id)) {
        return res
          .status(400)
          .json({ message: "Вы уже поставили рейтинг этому сайту" });
      }
      website.rating += rating;
      website.ratingCount.push(id);
      await website.save();
      res.status(200).json({ sucess: true });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }
};
