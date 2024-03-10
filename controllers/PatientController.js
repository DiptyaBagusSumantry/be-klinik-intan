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

class PatientController {
  static async createPatient(req, res) {
    try {
      const {
        fullname,
        place_birth,
        date_birth,
        gender,
        address,
        work,
        phone,
        history_illness,
      } = req.body;

      //number_regristation
      let countPatient = await Patient.findAll({
        attributes: ["number_regristation"],
      });
      if (countPatient.length <= 0) {
        countPatient.push({ number_regristation: "000000" });
      }
      countPatient.sort((a, b) => {
        return (
          parseInt(b.number_regristation) - parseInt(a.number_regristation)
        );
      });
      const numberRm = parseInt(countPatient[0].number_regristation) + 1;
      const number_regristation = String(numberRm).padStart(6, "0");

      await Patient.create({
        number_regristation,
        fullname,
        place_birth,
        date_birth,
        gender,
        address,
        work,
        phone,
        history_illness,
      });
      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getPatient(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {};
      //sorting
      whereClause.order = [["number_regristation", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      await Patient.findAll(whereClause).then((data) => {
        const results = data.map((patient) => {
          const {
            id,
            number_regristation,
            fullname,
            place_birth,
            date_birth,
            gender,
            address,
            work,
            phone,
            history_illness,
          } = patient.dataValues;

          return {
            id,
            number_regristation,
            fullname,
            place_birth,
            date_birth,
            gender,
            address,
            work,
            phone,
            history_illness,
          };
        });

        handleGetPaginator(res, paginator(results, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async detailPatient(req, res) {
    try {
      await Patient.findOne({
        where: {
          id: req.params.id,
        },
      }).then((data) => {
        handleGet(res, data);
      });
    } catch (error) {
      handlerError / (res, error);
    }
  }
  static async updatePatient(req, res) {
    try {
      const {
        fullname,
        place_birth,
        date_birth,
        gender,
        address,
        work,
        phone,
        history_illness,
      } = req.body;
      const updateData = await Patient.update(
        {
          fullname,
          place_birth,
          date_birth,
          gender,
          address,
          work,
          phone,
          history_illness,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      );
      handleUpdate(res, updateData);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async deletePatient(req, res) {
    try {
      const deleteData = await Patient.destroy({
        where: {
          id: req.params.id,
        },
      });
      handleDelete(res, deleteData);
    } catch (error) {
      handlerError(res, error);
    }
  }
}

module.exports = PatientController;
