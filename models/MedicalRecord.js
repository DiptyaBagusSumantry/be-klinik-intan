const Sequelize = require("sequelize");

const MedicalRecord = (sequelizeInstance) => {
  return sequelizeInstance.define(
    "medical_records",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: "id",
      },
      pelayanan: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "pelayanan tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "pelayanan tidak boleh kosong!",
          },
        },
      },
      keluhan: {
        type: Sequelize.STRING,
      },
      diagnosa: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "diagnosa tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "diagnosa tidak boleh kosong!",
          },
        },
      },
      kode_diagnosa: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Kode Diagnosa tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "Kode Diagnosa tidak boleh kosong!",
          },
        },
      },
      tindakan: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "tindakan tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "tindakan tidak boleh kosong!",
          },
        },
      },
      obat: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "obat tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "obat tidak boleh kosong!",
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

module.exports = MedicalRecord;
