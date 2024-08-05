const Models = require("../models/index");
const Transaction = Models.Transaction;
const {
  handlerError,
  handleUpdate,
  handleGetPaginator,
  handleGet,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");

class TransactionController {
  static async getTransaction(req, res) {
    try {
      const { page, search, sorting, invoiceId } = req.query;
      // const invoiceId = req.query.invoiceId;
      const whereClause = {
        include: {
          model: Models.MedicalRecord,
          include: { model: Models.Patient },
        },
      };
      //sorting
      whereClause.order = [["createdAt", sorting ? sorting : "DESC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "invoice", "fullname");
      }

      //detail invoice
      if (invoiceId) {
        whereClause.where = { id: invoiceId };
      }

      const getInvoice = await Transaction.findAll(whereClause);

      const results = getInvoice.map((data) => {
        let { id, invoice, total_payment, status, purchased, createdAt } =
          data.dataValues;
        const fullname =
          data.dataValues.medical_record.dataValues.patient.fullname;
        createdAt = new Date(createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
        return {
          id,
          idRekamMedis: data.dataValues.medical_record.dataValues.id,
          invoice,
          fullname,
          total_payment,
          status,
          createdAt,
          purchased: JSON.parse(purchased),
        };
      });
      // handleGetPaginator(res, paginator(results, page ? page : 1, 20));
      return handleGet(res, results);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getTypeTransaction(req, res) {
    try {
      await Transaction.findAll({
        where: {
          type: req.params.type,
        },
        include: [
          {
            model: Models.Reservation,
            include: [
              { model: Models.Patient },
              { model: Models.jadwalDokter },
            ],
          },
          { model: Models.MedicalRecord },
        ],
      }).then((results) => {
        const data = results.map((a) => {
          // console.log(a.dataValues);
          let {
            id,
            invoice,
            total_payment,
            status,
            purchased,
            createdAt,
            medicalRecordId,
          } = a.dataValues;
          const { no_rm, fullname } =
            a.dataValues.reservation.dataValues.patient.dataValues;
          const { poli, namaDokter } =
            a.dataValues.reservation.dataValues.jadwal_dokter.dataValues;
          const { ruangan, pembayaran } =
            a.dataValues.reservation.dataValues;
          const { diagnosa } = a.dataValues.medical_record;
          return {
            id,
            no_rm,
            fullname,
            invoice,
            total_payment,
            status,
            poli,
            namaDokter,
            diagnosa,
            ruangan,
            pembayaran,
            purchased: JSON.parse(purchased),
            medicalRecordId,
            createdAt,
          };
        });
        handleGet(res, data);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getInvoiceObat(req, res) {
    try {
      const get = await Transaction.findOne(
        {
          where: {
            id: req.params.id,
          },
          include: {model: Models.MedicalRecord}
        }
      );
  
      const data = {
        ...get.dataValues,
        obat: JSON.parse(get.dataValues.medical_record.dataValues.obat),
      };
      handleGet(res, data);
    } catch (error) {
      handlerError(res, error);
    }
  }
}

module.exports = TransactionController;
