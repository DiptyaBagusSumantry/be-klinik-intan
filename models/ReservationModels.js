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
      diagnosis: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Diagnosis Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Diagnosis Can't be Empty!",
          },
        },
      },
      service: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Service Can't be Null!",
          },
          notEmpty: {
            args: true,
            msg: "Service Can't be Empty!",
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
    },
    {
      freezeTableName: true,
      paranoid: true,
      underscored: true,
    }
  );
};

module.exports = reservation;
