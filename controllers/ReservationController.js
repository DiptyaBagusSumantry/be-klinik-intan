const Models = require("../models/index");
const RekamMedis = Models.HistoryPatient;
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

class ReservationController {
  static async createReservation(req, res) {
    try {
      const {
        date,
        diagnosis,
        therapy,
        service,
        description,
        odontogram,
        patient_id,
      } = req.body;

      //count total pyemnt
      let total_payment = 0;
      service.forEach((element) => {
        total_payment += parseInt(element.price);
      });
      if (isNaN(total_payment)) {
        const err = { message: "price must be integer" };
        return handlerError(res, err);
      }

      const createRM = await Reservation.create({
        date,
        diagnosis,
        therapy,
        service: JSON.stringify(service),
        description,
        odontogram: JSON.stringify(odontogram),
        patientId: patient_id,
      });

      await Transaction.create({
        invoice: `${new Date().getTime()}`,
        purchased: JSON.stringify(service),
        total_payment: total_payment.toString(),
        patientId: patient_id,
        historyPatientId: createRM.id,
      });

      handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  // static async getRM(req, res) {
  //   try {
  //     const { page, search, sorting } = req.query;
  //     let whereClause = { include: { model: Patient } };
  //     //sorting
  //     whereClause.order = [["createdAt", sorting ? sorting : "DESC"]];

  //     //searching
  //     if (search) {
  //       whereClause.where = searchWhere(search, "number_regristation", "phone");
  //     }

  //     await Reservation.findAll(whereClause).then((get) => {
  //       const results = get.map((data) => {
  //         const {
  //           id,
  //           date,
  //           description,
  //           service,
  //           odontogram,
  //           diagnosis,
  //           therapy,
  //         } = data.dataValues;
  //         const {
  //           id : id_patient,
  //           number_regristation,
  //           fullname,
  //           phone,
  //           gender,
  //         } = data.dataValues.patient;
  //         let hasil = "";
  //         const proses = JSON.parse(service);
  //         proses.forEach((data) => {
  //           hasil += data.name + ", ";
  //         });
  //         return {
  //           id,
  //           id_patient,
  //           number_regristation,
  //           description,
  //           date,
  //           fullname,
  //           gender,
  //           phone,
  //           hasil,
  //           diagnosis,
  //           therapy,
  //           odontogram: JSON.parse(odontogram)
  //         };
  //       });
  //       handleGetPaginator(res, paginator(results, page ? page : 1, 20));
  //     });
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async getDetailRM(req, res) {
  //   try {
  //     const get = await Reservation.findOne({
  //       where: { id: req.params.id },
  //       include: { model: Patient },
  //     });
  //     if (!get) {
  //       return handleGet(res, get);
  //     }

  //     const { id, diagnosis, therapy, description, date, service, odontogram } =
  //       get.dataValues;
  //     const {
  //       number_regristation,
  //       fullname,
  //       place_birth,
  //       date_birth,
  //       gender,
  //       phone,
  //       address,
  //       work,
  //       history_illness,
  //     } = get.dataValues.patient;

  //     const tgl = new Date(date).toLocaleDateString("id-ID", {
  //       day: "2-digit",
  //       month: "long",
  //       year: "numeric",
  //     });

  //     const data = {
  //       id,
  //       date: tgl,
  //       number_regristation,
  //       fullname,
  //       place_birth,
  //       date_birth,
  //       gender,
  //       phone,
  //       address,
  //       work,
  //       history_illness,
  //       diagnosis,
  //       therapy,
  //       description,
  //       service: JSON.parse(service),
  //       odontogram: JSON.parse(odontogram),
  //     };
  //     handleGet(res, data);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
  // static async getDetailbyPatient(req, res) {
  //   try {
  //     const get = await Patient.findAll({
  //       where: {
  //         id: req.params.id,
  //       },
  //       include: {
  //         model: Reservation,
  //       },
  //     });
  //     if (get.length <= 0) {
  //       return handleGet(res, get);
  //     }
  //     if (get[0].dataValues.history_patients.length <= 0) {
  //       return handlerError(res, { message: "History Rekam Medis Not Found" });
  //     }
  //     const Reservation = get[0].dataValues.history_patients;
  //     const data = Reservation.map((reuslt) => {
  //       const {
  //         id,
  //         date,
  //         diagnosis,
  //         therapy,
  //         description,
  //         service,
  //         odontogram,
  //       } = reuslt.dataValues;
  //       const {
  //         number_regristation,
  //         // fullname,
  //         // place_birth,
  //         // date_birth,
  //         // gender,
  //         // phone,
  //         // address,
  //         // work,
  //         // history_illness,
  //       } = get[0].dataValues;
  //       return {
  //         id,
  //         number_regristation,
  //         // fullname,
  //         // place_birth,
  //         // date_birth,
  //         // gender,
  //         // phone,
  //         // address,
  //         // work,
  //         // history_illness,
  //         date,
  //         // diagnosis,
  //         // therapy,
  //         description,
  //         service: JSON.parse(service),
  //         odontogram: JSON.parse(odontogram),
  //       };
  //     });
  //     // return res.send(data)
  //     handleGet(res, data);
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
