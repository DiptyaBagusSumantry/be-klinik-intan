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
      const { date, pembayaran, jadwalDokterId, patientId, jenisPerawatan, keluhan } = req.body;
      const userId = accesToken(req);
      // let patientId
      // console.log(userId);
      if (userId.role != "Patient" && !patientId) {
        return res.status(500).json({
          code: 500,
          msg: "Your Role not Patient, Please insert patientId!",
        });
      }
      if (userId.role == "Admin") {
        userId.id = patientId;
      }

      //check whether patient already reservation in date
      const chekPatient = await Reservation.findAll({
        where: { date, patientId },
      });
      if (chekPatient.length >0){
        return handlerError(res, {message: `Patient alaready reservation in date ${date}. Plesae Chek your reservation!`})
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

      // await Reservation.create({
      //   date,
      //   pembayaran,
      //   jadwalDokterId,
      //   patientId,
      //   queue,
      //   jenisPerawatan,
      //   keluhan,
      // });

      const detailPatient = await Models.Patient.findOne({
        where: {
          id: patientId
        }
      })
      const jadwalDokter = await Models.jadwalDokter.findOne({
        where: {
          id: jadwalDokterId
        }
      })
      // handleCreate(res);
      handleGet(res, {
        jadwalDokter: jadwalDokter,
        date,
        pembayaran,
        dataPatient: detailPatient,
        jenisPerawatan,
        keluhan,
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getReservation(req, res) {
    try {
      const userId = accesToken(req);
      const { page, search, sorting } = req.query;
      let whereClause = {
        include: [{ model: Patient }, { model: Models.jadwalDokter }],
        where: {},
      };
      //sorting
      whereClause.order = [["createdAt", sorting ? sorting : "DESC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "queue", "date");
      }

      if (userId.role != "Admin") {
        whereClause.where.patientId = userId.id;
      }

      await Reservation.findAll(whereClause).then((get) => {
        // console.log(patient.dataValues.user);
        const results = get.map((data) => {
          const {
            id,
            date,
            pembayaran,
            queue,
            status: statusPeriksa,
          } = data.dataValues;
          const {
            id: patientId,
            fullname,
            no_rm,
            phone,
            gender,
          } = data.dataValues.patient;
          const { namaDokter, poli } = data.dataValues.jadwal_dokter;
          return {
            id,
            queue,
            statusPeriksa,
            namaDokter,
            poli,
            pembayaran,
            patientId,
            no_rm,
            date,
            fullname,
            gender,
            phone,
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
      const data = await Reservation.findOne({
        where: { id: req.params.id },
        include: [{ model: Patient }, { model: Models.jadwalDokter }],
      });
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
