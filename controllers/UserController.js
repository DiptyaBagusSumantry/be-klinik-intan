const { where, Model } = require("sequelize");
const {
  handlerError,
  handleGet,
  handleGetPaginator,
  handleCreate,
  handleDelete,
  handleUpdate,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const Models = require("../models/index.js");
const { Result } = require("express-validator");
const User = Models.User;
const moment = require("moment");

class UserController {
  static async amountDashboard(req, res) {
    try {
      const amount_patient = await Models.Patient.count();
      const amount_medical_record = await Models.Reservation.count();
      const amountReservation = await Models.Reservation.count({
        where: {
          date: moment().format("YYYY-MM-DD"),
        },
      });
      const amount_docter = await Models.User.count({
        include: {
          model: Models.Role,
          where: { name: "Dokter" },
        },
      });
      const amount_service = await Models.Service.count();
      const amount_user = await Models.User.count();

      handleGet(res, {
        amount_patient,
        amount_medical_record,
        amount_docter,
        amount_service,
        amount_user,
        amountReservation,
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async createUser(req, res) {
    try {
      const { fullname, username, password, phone, email, roleId } = req.body;
      await Models.User.create({
        fullname,
        username,
        password,
        phone,
        email,
        roleId,
      }).then((result) => {
        handleCreate(res);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async updateUser(req, res) {
    try {
      const { fullname, username, password, phone, email, roleId } = req.body;
      await Models.User.update(
        {
          fullname,
          username,
          password,
          phone,
          email,
          roleId,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then((result) => {
        handleUpdate(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getRole(req, res) {
    try {
      await Models.Role.findAll().then((result) => {
        handleGet(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getUser(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {
        include: { model: Models.Role },
      };
      //sorting
      whereClause.order = [["fullname", sorting ? sorting : "ASC"]];
      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      await User.findAll(whereClause).then((data) => {
        const dataUser = data.map((result) => {
          const { id, fullname, email, phone } = result;
          return {
            id,
            fullname,
            email,
            phone,
            role: result.role.name,
          };
        });
        handleGetPaginator(res, paginator(dataUser, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getUserById(req, res) {
    try {
      await User.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        handleGet(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async deleteUser(req, res) {
    try {
      await User.findOne({
        include: { model: Models.Role, where: { name: "Admin" } },
      }).then((result) => {
        if (req.params.id == result.id) {
          return handlerError(res, { message: "Please chek Id!" });
        }
      });
      await User.destroy({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        handleDelete(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
}

module.exports = UserController;
