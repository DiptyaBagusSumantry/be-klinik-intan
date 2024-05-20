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
      const { nik, date_birth, gender, address, work, fullname, phone } =
        req.body;

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
      });
      return handleCreate(res);
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
        // include: { model: Models.User }
      };
      //sorting
      whereClause.order = [["no_rm", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "fullname", "phone");
      }

      // if (token.role != "Admin") {
      //   whereClause.where.user_id = token.id;
      // }

      const getPatient = await Patient.findAll(whereClause);

      
      const token = accesToken(req);
      console.log(token.role)
      if (token.role != "patient") {
        return handleGetPaginator(
          res,
          paginator(getPatient, page ? page : 1, 20)
        );
      }
      handleGet(res, getPatient);

      // .then((data) => {
      //   // return res.send(data)
      //   const results = data.map((patient) => {
      //     // const { no_rm, nik, place_birth, date_birth, gender, address, work } =
      //     //   patient.dataValues;
      //     // const { id, username, fullname, phone, email } =
      //     //   patient.dataValues.user;
      //     // const {id, no_rm, nik, fullname, date_birth, gender}

      //     return {
      //       id,
      //       no_rm,
      //       nik,
      //       fullname,
      //       place_birth,
      //       date_birth,
      //       gender,
      //       address,
      //       work,
      //       phone,
      //       username,
      //       email,
      //     };
      //   });
      //   if (token.role != "Patient") {
      //     return handleGetPaginator(
      //       res,
      //       paginator(results, page ? page : 1, 20)
      //     );
      //   }
      //   handleGet(res, results[0]);
      // });
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
  // static async updateUserId(req, res) {
  //   try {
  //     const token = accesToken(req);
  //     await Patient.update(
  //       {
  //         userId: token.id,
  //       },
  //       {
  //         where: {
  //           id: req.params.id,
  //         },
  //       }
  //     ).then((status) => {
  //       handleUpdate(res, status);
  //     });
  //   } catch (error) {
  //     handlerError(req, error);
  //   }
  // }
  static async detailPatient(req, res) {
    try {
      await Patient.findOne({
        where: { id: req.params.id },
        include: { model: Models.User },
      }).then((patient) => {
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
      handlerError / (res, error);
    }
  }
  static async updatePatient(req, res) {
    try {
      const token = accesToken(req);
      const {
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
      } = req.body;
      const userId = req.params.id;
      if (token.id != userId && token.role != "Admin") {
        return res.status(500).json({
          code: 500,
          msg: "No Acces Update by id, Please chek Your Id!",
        });
      }
      await Models.User.update(
        {
          username,
          fullname,
          phone,
          email,
        },
        { where: { id: userId } }
      ).then(async (data) => {
        await Patient.update(
          {
            nik,
            place_birth,
            date_birth,
            gender,
            address,
            work,
          },
          { where: { user_id: userId } }
        );
        handleUpdate(res, data);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
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
