const Sequelize = require("sequelize");

const Role = (sequelizeInstance) => {
  return sequelizeInstance.define(
    "roles",
    {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: "id",
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: {
          args: "name",
          msg: "Role Already Registered!",
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

module.exports = Role;
