const { validationResult } = require("express-validator");

const Request = require("../../models/Request");
const Comment = require("../../models/Comment");

module.exports = class adminController {
  async getRequest(req, res) {
    try {
      const requests = await Request.find({});
      res.status(200).json({ requests });
    } catch (error) {
      res.status(400).json({ message: "Что-то пошло не так :(" });
    }
  }
};
