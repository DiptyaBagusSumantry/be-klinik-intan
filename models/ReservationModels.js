const Sequelize = require("sequelize");

const reservation = (sequelizeInstance) => {
  return sequelizeInstance.define(
    "reservations",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: "id",
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Date Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Date Can't be Empty!",
          },
          isDate: {
            args: true,
            msg: "Date Must be format yyyy-mm-dd",
          },
        },
      },
      queue: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Queue Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Queue Can't be Empty!",
          },
        },
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
          notNull: {
            args: true,
            msg: "Status Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Status Can't be Empty!",
          },
        },
      },
      pembayaran: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Pembayaran Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Pembayaran Can't be Empty!",
          },
        },
      },
      jenisPerawatan: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "jenisPerawatan Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "jenisPerawatan Can't be Empty!",
          },
        },
      },
      namaPetugas: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Nama Petugas Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Nama Petugas Can't be Empty!",
          },
        },
      },
      keluhan: {
        type: Sequelize.STRING,
      },
      ruangan: {
        type: Sequelize.STRING,
      },
      pengantarPatient: {
        type: Sequelize.STRING,
      },
      diagnosa: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
    }
  );
};

module.exports = reservation;
