const Models = require("../models/index.js");
const Patient = Models.Patient;
const {
  handleCreate,
  handlerError,
  handleGet,
  handleUpdate,
  handleGetPaginator,
  handleDelete,
} = require("../helper/HandlerError.js");
const sequelize = require("sequelize");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const { Op } = require("sequelize");
const { accesToken } = require("../helper/chekAccessToken.js");

class PatientController {
  static async createPatient(req, res) {
    try {
      const {
        nik,
        fullname,
        place_birth,
        date_birth,
        gender,
        address,
        work,
        phone,
        user_id,
      } = req.body;

      const token = accesToken(req);
      let userId = token.id;
      if (token.role == "Admin") {
        userId = user_id;
      }
      if (!userId) {
        return handlerError(res, {
          message: "Your Role is Admin, Please insert user_id",
        });
      }

      //no_rm
      let countPatient = await Patient.findAll({
        attributes: ["no_rm"],
      });
      if (countPatient.length <= 0) {
        countPatient.push({ no_rm: "000000" });
      }
      countPatient.sort((a, b) => {
        return parseInt(b.no_rm) - parseInt(a.no_rm);
      });
      const numberRm = parseInt(countPatient[0].no_rm) + 1;
      const no_rm = String(numberRm).padStart(6, "0");

      await Patient.create({
        no_rm,
        nik,
        fullname,
        place_birth,
        date_birth,
        gender,
        address,
        work,
        phone,
        userId,
      });
      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getPatient(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {where:{}};
      //sorting
      whereClause.order = [["no_rm", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      const token = accesToken(req);
      if (token.role != "Admin") {
        whereClause.where.user_id = token.id
      }
      console.log(whereClause)
      await Patient.findAll(whereClause).then((data) => {
        const results = data.map((patient) => {
          const {
            id,
            no_rm,
            nik,
            fullname,
            place_birth,
            date_birth,
            gender,
            address,
            work,
            phone,
          } = patient.dataValues;

          return {
            id,
            no_rm,
            nik,
            fullname,
            place_birth,
            date_birth,
            gender,
            address,
            work,
            phone,
          };
        });

        handleGetPaginator(res, paginator(results, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  // static async detailPatient(req, res) {
  //   try {
  //     await Patient.findOne({
  //       where: {
  //         id: req.params.id,
  //       },
  //     }).then((data) => {
  //       handleGet(res, data);
  //     });
  //   } catch (error) {
  //     handlerError / (res, error);
  //   }
  // }
  // static async updatePatient(req, res) {
  //   try {
  //     const {
  //       fullname,
  //       place_birth,
  //       date_birth,
  //       gender,
  //       address,
  //       work,
  //       phone,
  //       history_illness,
  //     } = req.body;
  //     const updateData = await Patient.update(
  //       {
  //         fullname,
  //         place_birth,
  //         date_birth,
  //         gender,
  //         address,
  //         work,
  //         phone,
  //         history_illness,
  //       },
  //       {
  //         where: {
  //           id: req.params.id,
  //         },
  //       }
  //     );
  //     handleUpdate(res, updateData);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async deletePatient(req, res) {
  //   try {
  //     const deleteData = await Patient.destroy({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });
  //     handleDelete(res, deleteData);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
}

module.exports = PatientController;
