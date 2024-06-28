const Models = require("../models/index.js");
const MedicalRecords = Models.MedicalRecord;
const {
  handlerError,
  handleCreate,
  handleGet,
  handleGetPaginator,
  handleUpdate,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const moment = require("moment");


class MedicalRecord {
  static async createMedicalRecord(req, res) {
    try {
      const {
        pelayanan,
        keluhan,
        diagnosa,
        tindakan,
        biayaLayanan,
        biayaObat,
        patientId,
        statusPembayaran,
        kodeDiagnosa,
        idReservasi,
      } = req.body;

      const chekReservation = await Models.Reservation.findOne({
        where: { id: idReservasi, status: false },
      });
      if (!chekReservation) {
        return handlerError(res, {
          message:
            "Medical record already created in today or patient not yet create reservation in today, please check get medical record! or chek get reservation!",
        });
      }
      const biaya = biayaLayanan + biayaObat;
      const dataMR = await MedicalRecords.create({
        pelayanan,
        keluhan,
        diagnosa,
        tindakan,
        patientId,
        kode_diagnosa: kodeDiagnosa,
      });
      await Models.Transaction.create({
        total_payment: biaya,
        invoice: `${new Date().getTime()}`,
        status: statusPembayaran ? statusPembayaran : "BELUM LUNAS",
        purchased: JSON.stringify({ biayaLayanan, biayaObat }),
        medicalRecordId: dataMR.id,
      });
      await Models.Reservation.update(
        {
          status: true,
        },
        {
          where: {
            id: idReservasi,
          },
        }
      );
      return handleCreate(res);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getMedicalRecord(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {
        where: {},
        include: [{ model: Models.Patient }, { model: Models.Transaction }],
      };
      //sorting
      whereClause.order = [["created_at", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(
          search,
          "patient.fullname",
          "patient.phone"
        );
      }

      const data = await MedicalRecords.findAll(whereClause);

      const result = data.map((MedicalRecord) => {
        let {
          id,
          pelayanan,
          keluhan,
          diagnosa,
          tindakan,
          createdAt,
          kode_diagnosa,
        } = MedicalRecord.dataValues;
        const { purchased, status } = MedicalRecord.dataValues.transaction;
        const biayaLayanan = JSON.parse(purchased).biayaLayanan;
        const biayaObat = JSON.parse(purchased).biayaObat;
        createdAt = new Date(createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });

        return {
          id,
          fullname: MedicalRecord.dataValues.patient.fullname,
          patientId: MedicalRecord.dataValues.patient.id,
          pelayanan,
          keluhan,
          diagnosa,
          kode_diagnosa,
          tindakan,
          createdAt,
          biayaLayanan,
          biayaObat,
          statusPembayran: status,
        };
      });

      return handleGetPaginator(res, paginator(result, page ? page : 1, 20));
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async updateMedicalRecord(req, res) {
    try {
      const {
        pelayanan,
        keluhan,
        diagnosa,
        tindakan,
        biayaLayanan,
        biayaObat,
        patientId,
        statusPembayaran,
        kodeDiagnosa,
      } = req.body;

      const getDetailRM = await MedicalRecords.findOne({
        where: {
          id: req.params.id,
        },
        raw: true,
      });
      const getTransaction = await Models.Transaction.findOne({
        where: {
          medicalRecordId: req.params.id,
        },
        raw: true,
      });
      console.log(getDetailRM)
      console.log(getTransaction)
      const biaya = biayaLayanan + biayaObat;
      await MedicalRecords.update(
        {
          pelayanan: pelayanan ? pelayanan : getDetailRM.pelayanan,
          keluhan: keluhan ? keluhan : getDetailRM.keluhan,
          diagnosa: diagnosa ? diagnosa : getDetailRM.diagnosa,
          tindakan: tindakan ? tindakan : getDetailRM.tindakan,
          patientId: patientId ? patientId : getDetailRM.patientId,
          kode_diagnosa: kodeDiagnosa ? kodeDiagnosa : getDetailRM.kode_diagnosa,
        },
        {
          where: { id: req.params.id },
        }
      );
    
      const updateTransactioon = await Models.Transaction.update(
        {
          total_payment: biaya ? biaya : getTransaction.total_payment,
          invoice: `${new Date().getTime()}`,
          status: statusPembayaran ? statusPembayaran : "BELUM LUNAS",
          purchased: JSON.stringify({ biayaLayanan, biayaObat }) ? JSON.stringify({ biayaLayanan, biayaObat }) : getTransaction.purchased,
          patientId: patientId ? patientId : getDetailRM.patientId,
        },
        {
          where: { medicalRecordId: req.params.id },
        }
      );
      return handleUpdate(res, updateTransactioon);
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async detailMedicalRecord(req, res) {
    try {
      await MedicalRecords.findOne({
        where: {
          id: req.params.id,
        },
        include: [{ model: Models.Patient }, { model: Models.Transaction }],
      }).then((result) => {
        const {
          id,
          pelayanan,
          keluhan,
          diagnosa,
          kodeDiagnosa,
          tindakan,
          patientId,
        } = result.dataValues;
        const {
          no_rm,
          nik,
          fullname,
          date_birth,
          gender,
          address,
          work,
          phone,
          statusPerkawinan,
          agama,
          riwayatAlergiObat,
          riwayatAlergiMakanan,
          riwayatAlergiLainya,
        } = result.dataValues.patient.dataValues;
        const {
          id: idTransaction,
          total_payment,
          status,
          purchased,
        } = result.dataValues.transaction.dataValues;
        // console.log(result)
        handleGet(res, {
          id,
          pelayanan,
          keluhan,
          diagnosa,
          kodeDiagnosa,
          tindakan,
          patientId,
          no_rm,
          nik,
          fullname,
          date_birth,
          gender,
          address,
          work,
          phone,
          statusPerkawinan,
          agama,
          riwayatAlergiObat,
          riwayatAlergiMakanan,
          riwayatAlergiLainya,
          idTransaction,
          total_payment,
          status,
          purchased: JSON.parse(purchased),
        });
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
}
module.exports = MedicalRecord;
