const {
  handlerError,
  handleGet,
  handleGetPaginator,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const Models = require("../models/index.js");
const User = Models.User;

class UserController {
  static async getUser(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {
        include: { model: Models.Role, where: { name: "user" } },
      };
      //sorting
      whereClause.order = [["fullname", sorting ? sorting : "ASC"]];
      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      await User.findAll(whereClause).then((data) => {
        handleGetPaginator(res, paginator(data, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
}

module.exports = UserController;
