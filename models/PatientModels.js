const Sequelize = require("sequelize");

const Patient = (sequelizeInstance) => {
  return sequelizeInstance.define(
    "patients",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: "id",
      },
      no_rm: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: "no_rm",
          msg: "Number Rekam Medis Already Registered!",
        },
        validate: {
          notNull: {
            args: true,
            msg: "Number Rekam Medis Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Number Rekam Medis Can't be Empty!",
          },
        },
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: "nik",
          msg: "NIK Already Registered!",
        },
        validate: {
          notNull: {
            args: true,
            msg: "NIK Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "NIK Can't be Empty!",
          },
          len: {
            args: 16,
            msg: "NIK Must be 16 Number!",
          },
          isNumeric: {
            args: true,
            msg: "Phone Must be Number",
          },
        },
      },
      fullname: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Fullname Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Fullname Can't be Empty!",
          },
        },
      },
      date_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Date Birth Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Date Birth Can't be Empty!",
          },
          isDate: {
            args: true,
            msg: "Date Must be format yyyy-mm-dd",
          },
        },
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Gender Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Gender Can't be Empty!",
          },
        },
      },
      address: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Address Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Address Can't be Empty!",
          },
        },
      },
      work: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "work Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "work Can't be Empty!",
          },
        },
      },
      phone: {
        type: Sequelize.STRING,
        unique: {
          args: "phone",
          msg: "Phone Already Registered!",
        },
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Phone Can't be Null",
          },
          notEmpty: {
            args: true,
            msg: "Phone Can't be Empty",
          },
          isNumeric: {
            args: true,
            msg: "Phone Must be Number",
          },
          len: {
            args: [10, 15],
            msg: "Phone Must be 10 - 15 Number!",
          },
        },
      },
    },
    {
      freezeTableName: true,
      // paranoid: true,
      underscored: true,
    }
  );
};

module.exports = Patient;
