const dbConfig = require("../config/config.js");
const Sequelize = require("sequelize");
const User = require("./UserModels.js");
const Patient = require("./PatientModels.js");
const Reservation = require("./ReservationModels.js");
const Transaction = require("./TransactionModels.js");
const Service = require("./ServiceModels.js");
const Role = require("./RoleModels.js")

const sequelizeInstance = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: 0,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

const db = {};
db.sequelizeInstance = sequelizeInstance;
db.User = User(sequelizeInstance);
db.Patient = Patient(sequelizeInstance);
db.Reservation = Reservation(sequelizeInstance);
db.Transaction = Transaction(sequelizeInstance);
db.Service = Service(sequelizeInstance);
db.Role = Role(sequelizeInstance)

//Role - User
db.Role.hasMany(db.User, {
    foreignKey: {
        name: 'roleId',
        type: Sequelize.UUID,
        allowNull: false
    }
})

db.User.belongsTo(db.Role, {
  targetKey: "id",
});

//User - Patient
db.User.hasMany(db.Patient, {
    foreignKey: {
        name: 'userId',
        type: Sequelize.UUID,
        allowNull: false
    }
})

db.Patient.belongsTo(db.User, {
  targetKey: "id",
});

//Patient - Reservation
db.Patient.hasMany(db.Reservation, {
    foreignKey: {
        name: 'patientId',
        type: Sequelize.UUID,
        allowNull: false
    }
})

db.Reservation.belongsTo(db.Patient, {
  targetKey: "id",
});


//Transaction - Reservation
db.Reservation.hasOne(db.Transaction, {
    foreignKey: {
        name: 'reservationId',
        type: Sequelize.UUID,
        allowNull: false
    }
})

db.Transaction.belongsTo(db.Reservation, {
  targetKey: "id",
});





module.exports = db;
