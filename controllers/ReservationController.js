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
      const { date, diagnosis, service, patient_id } = req.body;

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
        patientId: patient_id,
      });

      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getReservation(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = { include: { model: Patient }, where: {} };
      //sorting
      whereClause.order = [["createdAt", sorting ? sorting : "DESC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "queue", "id");
      }

      await Reservation.findAll(whereClause).then((get) => {
        const results = get.map((data) => {
          const { id, date, diagnosis, service, queue} = data.dataValues;
          const {
            id: id_patient,
            no_rm,
            fullname,
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
            id_patient,
            queue,
            no_rm,
            date,
            fullname,
            gender,
            phone,
            hasil,
            diagnosis
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
      const get = await Reservation.findOne({
        where: { id: req.params.id },
      });
      if (!get) {
        return handleGet(res, get);
      }

      const { id, queue, diagnosis, date, service } =
        get.dataValues;

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
  static async getDetailbyPatient(req, res) {
    try {
      await Reservation.findAll({
        where: {
          patient_id: req.params.patientId
        },
        order : [["date", "DESC"]]
      }).then(results=>{
        const data = results.map(get =>{
          const {id,date,diagnosis,service,queue} = get.dataValues
          const parseService= JSON.parse(service)
          return {
            id,
            queue,
            date,
            diagnosis,
            service: parseService,
          };
        })
        handleGet(res, data);
      })
    } catch (error) {
      handlerError(res, error);
    }
  }
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
