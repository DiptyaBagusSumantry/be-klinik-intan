const Models = require("../models/index.js");
const Service = Models.Service;
const {
  handlerError,
  handleCreate,
  handleGet,
  handleUpdate,
  handleDelete,
  handleGetPaginator,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");

class ServiceController {
  static async createService(req, res) {
    try {
      const { code, name, price } = req.body;
      await Service.create({
        code,
        name,
        price,
      });
      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getService(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {};
      //sorting
      whereClause.order = [["name", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "name", "code");
      }

      const results = await Service.findAll(whereClause);
      handleGetPaginator(res, paginator(results, page ? page : 1, 20));
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async updateService(req, res) {
    try {
      const { code, name, price } = req.body;
      await Service.update(
        {
          code,
          name,
          price,
        },
        {
          where: { id: req.params.id },
        }
      ).then((result) => {
        handleUpdate(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  // static async getDetailService(req, res) {
  //   try {
  //     const get = await Service.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });
  //     handleGet(res, get);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async updatetService(req, res) {
  //   try {
  //     const { code, name, price } = req.body;
  //     const update = await Service.update(
  //       {
  //         code,
  //         name,
  //         price,
  //       },
  //       {
  //         where: { id: req.params.id },
  //       }
  //     );
  //     handleUpdate(res, update);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async deleteService(req, res) {
  //   try {
  //     const get = await Service.destroy({
  //       where: { id: req.params.id },
  //     });
  //     handleDelete(res, get);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
}

module.exports = ServiceController;
