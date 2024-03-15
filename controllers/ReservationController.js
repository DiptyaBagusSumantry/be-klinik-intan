const Models = require("../models/index");
const Reservation = Models.Reservation;
const Patient = Models.Patient;
const Transaction = Models.Transaction;
const {
  handlerError,
  handleCreate,
  handleGet,
  handleGetPaginator,
  handleDelete,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const { accesToken } = require("../helper/chekAccessToken.js");

class ReservationController {
  static async createReservation(req, res) {
    try {
      const { date, diagnosis, service, user_id } = req.body;
      const userId = accesToken(req);
      if (userId.role != "Patient" && !user_id) {
        return res.status(500).json({
          code: 500,
          msg: "Your Role is Admin, Please insert user_id!",
        });
      }
      const patientId = await Patient.findOne({
        where: { user_id: userId.id },
      });
      // a9cb171a-f3e5-4416-ae95-4dc8bb17b5e0
      let total_payment = 0;
      service.forEach((element) => {
        total_payment += parseInt(element.price);
      });
      if (isNaN(total_payment)) {
        const err = { message: "price must be integer" };
        return handlerError(res, err);
      }

      //queue
      let countPatient = await Reservation.findAll({
        where: { date },
      });
      if (countPatient.length <= 0) {
        countPatient.push({ queue: "000" });
      }
      countPatient.sort((a, b) => {
        return parseInt(b.queue) - parseInt(a.queue);
      });
      const numberRm = parseInt(countPatient[0].queue) + 1;
      const queue = String(numberRm).padStart(3, "0");

      await Reservation.create({
        date,
        diagnosis,
        queue,
        service: JSON.stringify(service),
        patientId: patientId.id,
      });

      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getReservation(req, res) {
    try {
      const token = accesToken(req);
      const { page, search, sorting } = req.query;
      let whereClause = { include: { model: Patient }, where: {} };
      //sorting
      whereClause.order = [["createdAt", sorting ? sorting : "DESC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "queue", "date");
      }

      const patient = await Patient.findOne({
        where: { user_id: token.id },
        include: {model: Models.User}
      })

      //otorisasi user
      if (token.role != "Admin") {
          whereClause.where.patientId = patient.id

      }

      await Reservation.findAll(whereClause).then((get) => {
        console.log(patient.dataValues.user);
        const results = get.map((data) => {
          const { id, date, diagnosis, service, queue } = data.dataValues;
          const {
            userId: patientId,
            no_rm,
            phone,
            gender,
          } = data.dataValues.patient;
          let hasil = "";
          const proses = JSON.parse(service);
          proses.forEach((data) => {
            hasil += data.name + ", ";
          });
          return {
            id,
            patientId,
            queue,
            no_rm,
            date,
            fullname: patient.dataValues.user.fullname,
            gender,
            phone,
            hasil,
            diagnosis,
          };
        });
        handleGetPaginator(res, paginator(results, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getDetailReservation(req, res) {
    try {
      let whereClause = { where: { id: req.params.id } };
      const token = accesToken(req)

      //otorisasi user
      if (token.role != "Admin") {
        await Patient.findOne({
          where: { user_id: token.id },
        }).then((res) => {
          whereClause.where.patientId = res.id
        });
      }

      const get = await Reservation.findOne(whereClause);
      if (!get) {
        return handleGet(res, []);
      }

      const { id, queue, diagnosis, date, service } = get.dataValues;

      const tgl = new Date(date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const data = {
        id,
        queue,
        date: tgl,
        diagnosis,
        service: JSON.parse(service),
      };

      handleGet(res, data);
    } catch (error) {
      handlerError(res, error);
    }
  }
  // static async getDetailbyPatient(req, res) {
  //   try {
  //     await Reservation.findAll({
  //       where: {
  //         patient_id: req.params.patientId,
  //       },
  //       order: [["date", "DESC"]],
  //     }).then((results) => {
  //       const data = results.map((get) => {
  //         const { id, date, diagnosis, service, queue } = get.dataValues;
  //         const parseService = JSON.parse(service);
  //         return {
  //           id,
  //           queue,
  //           date,
  //           diagnosis,
  //           service: parseService,
  //         };
  //       });
  //       handleGet(res, data);
  //     });
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async deleteReservation(req, res) {
  //   try {
  //     const deleteRM = await Reservation.destroy({
  //       where: {
  //         id: req.params.id,
  //       },
  //     });
  //     handleDelete(res, deleteRM);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
}

module.exports = ReservationController;
