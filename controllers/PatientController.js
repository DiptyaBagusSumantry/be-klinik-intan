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
const { paginator } = require("../helper/Pagination.js");
const { searchWhere, searchWhereCheck } = require("../helper/Search.js");
const { accesToken } = require("../helper/chekAccessToken.js");

class PatientController {
  static async createPatient(req, res) {
    let patientId;
    try {
      const {
        nik,
        date_birth,
        gender,
        address,
        work,
        fullname,
        phone,
        statusPerkawinan,
        agama,
        riwayatAlergiObat,
        riwayatAlergiMakanan,
        riwayatAlergiLainya,
      } = req.body;

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
        date_birth,
        gender,
        address,
        work,
        fullname,
        phone,
        statusPerkawinan: statusPerkawinan ? statusPerkawinan : null,
        agama: agama ? agama : null,
        riwayatAlergiObat: riwayatAlergiObat ? riwayatAlergiObat : null,
        riwayatAlergiMakanan: riwayatAlergiMakanan
          ? riwayatAlergiMakanan
          : null,
        riwayatAlergiLainya: riwayatAlergiLainya ? riwayatAlergiLainya : null,
      });
      return res.status(201).json({
        code: 201,
        message: "Success Create Data",
        data: {
          nik,
          no_rm,
        },
      });
    } catch (error) {
      if (error.errors) {
        await Models.User.destroy({
          where: {
            id: patientId ? patientId : "",
          },
        });
      }
      handlerError(res, error);
    }
  }
  static async getPatient(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {
        where: {},
      };
      //sorting
      whereClause.order = [["no_rm", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      const getPatient = await Patient.findAll(whereClause);

      const token = accesToken(req);
      // console.log(token.role);
      if (token.role != "patient") {
        return handleGetPaginator(
          res,
          paginator(getPatient, page ? page : 1, 20)
        );
      }
      handleGet(res, getPatient);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async chekPatient(req, res) {
    try {
      const { nik, date_birth } = req.query;
      if (!nik || !date_birth) {
        return res
          .status(500)
          .json({ code: 500, msg: "Please Insert nik and date_birth !" });
      }
      const whereClause = {
        where: searchWhereCheck(nik, date_birth, "nik", "date_birth"),
        include: { model: Models.User },
      };
      await Patient.findOne(whereClause).then((patient) => {
        if (!patient) {
          return res.status(404).json({ code: 404, msg: "Data Not Found!" });
        }
        const { no_rm, nik, place_birth, date_birth, gender, address, work } =
          patient.dataValues;
        const { id, username, fullname, phone, email } =
          patient.dataValues.user;
        const data = {
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
          username,
          email,
        };
        handleGet(res, data);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }

  static async detailPatient(req, res) {
    try {
      await Patient.findOne({
        where: { id: req.params.id },
        include: { model: Models.MedicalRecord },
      }).then((result) => {
        handleGet(res, result);
      });
    } catch (error) {
      handlerError / (res, error);
    }
  }
  static async updatePatient(req, res) {
    try {
      const token = accesToken(req);
      const {
        nik,
        date_birth,
        gender,
        address,
        work,
        fullname,
        phone,
        statusPerkawinan,
        agama,
        riwayatAlergiObat,
        riwayatAlergiMakanan,
        riwayatAlergiLainya,
      } = req.body;

      const data = await Patient.update(
        {
          nik,
          date_birth,
          gender,
          address,
          work,
          fullname,
          phone,
          statusPerkawinan: statusPerkawinan ? statusPerkawinan : null,
          agama: agama ? agama : null,
          riwayatAlergiObat: riwayatAlergiObat ? riwayatAlergiObat : null,
          riwayatAlergiMakanan: riwayatAlergiMakanan
            ? riwayatAlergiMakanan
            : null,
          riwayatAlergiLainya: riwayatAlergiLainya ? riwayatAlergiLainya : null,
        },
        { where: { id: req.params.id } }
      );
      handleUpdate(res, data);
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
