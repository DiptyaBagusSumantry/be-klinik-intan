const Sequelize = require("sequelize");

const jadwalDokter = (sequelizeInstance) => {
  return sequelizeInstance.define(
    "jadwal_dokters",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: "id",
      },
      namaDokter: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "nama dokter tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "nama dokter tidak boleh kosong!",
          },
        },
      },
      poli: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "poli tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "poli tidak boleh kosong!",
          },
        },
      },
      hariKerja: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "hari kerja tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "hari kerja tidak boleh kosong!",
          },
        },
      },
      jamMulai: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "jam mulai tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "jam mulai tidak boleh kosong!",
          },
        },
      },
      jamSelesai: {
        type: Sequelize.TIME,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "jam selesai tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "jam selesai tidak boleh kosong!",
          },
        },
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
    }
  );
};

module.exports = jadwalDokter;
