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
      // namaPasien: {
      //   type: Sequelize.STRING,
      //   allowNull: false,
      //   validate: {
      //     notNull: {
      //       args: true,
      //       msg: "nama pasien tidak boleh null!",
      //     },
      //     notEmpty: {
      //       args: true,
      //       msg: "nama pasien tidak boleh kosong!",
      //     },
      //   },
      // },
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
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "keluhan tidak boleh null!",
          },
          notEmpty: {
            args: true,
            msg: "keluhan tidak boleh kosong!",
          },
        },
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
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
    }
  );
};

module.exports = MedicalRecord;
