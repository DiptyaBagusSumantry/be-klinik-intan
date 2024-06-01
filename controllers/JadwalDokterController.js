const { Result } = require("express-validator");
const {
  handlerError,
  handleCreate,
  handleGet,
  handleDelete,
  handleUpdate,
  handleGetPaginator,
} = require("../helper/HandlerError.js");
const Models = require("../models/index.js");
const { param } = require("../routes/index.js");
const { where } = require("sequelize");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const JadwalDR = Models.jadwalDokter;

class JadwalDokterController {
  static async createJadwalDokter(req, res) {
    try {
      const {
        namaDokter,
        poli,
        hariKerja: hariKerja = `${hariKerja}:00`,
        jamMulai,
        jamSelesai,
      } = req.body;
      await JadwalDR.create({
        namaDokter,
        poli,
        hariKerja,
        jamMulai,
        jamSelesai,
      }).then((result) => {
        handleCreate(res);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async updateJadwalDokter(req, res) {
    try {
      const {
        namaDokter,
        poli,
        hariKerja: hariKerja = `${hariKerja}:00`,
        jamMulai,
        jamSelesai,
      } = req.body;
      await JadwalDR.update(
        {
          namaDokter,
          poli,
          hariKerja,
          jamMulai,
          jamSelesai,
        },
        {
          where: {
            id: req.params.id,
          },
        }
      ).then((result) => {
        handleUpdate(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getDokter(req, res) {
    try {
      await Models.User.findAll({
        include: { model: Models.Role, where: { name: "Dokter" } },
      }).then((result) => {
        const data = result.map((a) => {
          const { id, fullname } = a.dataValues;
          return {
            id,
            fullname,
          };
        });
        handleGet(res, data);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getJadwalDokter(req, res) {
    try {
      const { page, search, sorting } = req.query;
      let whereClause = {};

      //sorting
      whereClause.order = [["poli", sorting ? sorting : "ASC"]];

      //searching
      if (search) {
        whereClause.where = searchWhere(search, "nama_dokter", "poli");
      }

      await JadwalDR.findAll(whereClause).then((result) => {
        return handleGetPaginator(res, paginator(result, page ? page : 1, 20));
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async getDetailJadwalDokter(req, res) {
    try {
      await JadwalDR.findOne({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        handleGet(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async deleteJadwalDokter(req, res) {
    try {
      await JadwalDR.destroy({
        where: {
          id: req.params.id,
        },
      }).then((result) => {
        handleDelete(res, result);
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
}

module.exports = JadwalDokterController;
