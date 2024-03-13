const router = require("express").Router();
const verifyToken = require("../middlewares/VerifyToken");
const AuthController = require("../controllers/AuthController.js");
const PatientController = require("../controllers/PatientController.js");
const ReservationController = require("../controllers/ReservationController.js");
const TransactionController = require("../controllers/TransactionController.js");

const { IsAdmin, IsUser } = require("../middlewares/chekRole.js");
const UserController = require("../controllers/UserController.js");
const ServiceController = require("../controllers/ServiceController.js");

router.post("/login", AuthController.Login);
router.post("/register", AuthController.register);
router.get("/fetch", verifyToken, AuthController.Fetch);

router.post("/patient", verifyToken, PatientController.createPatient);
router.get("/patient", verifyToken, PatientController.getPatient);
router.get("/check-patient", verifyToken, PatientController.chekPatient);

router.post("/reservation", verifyToken, ReservationController.createReservation);
router.get("/reservation/:id", verifyToken, ReservationController.getDetailReservation);

//ADMIN
router.get("/user", verifyToken, IsAdmin, UserController.getUser);
router.get("/reservation", verifyToken, IsAdmin, ReservationController.getReservation);
router.post("/service", verifyToken, IsAdmin, ServiceController.createService);
router.get("/service", verifyToken, ServiceController.getService);
router.get("/transaction", verifyToken, TransactionController.getTransaction);

//USER
router.get("/reservation-patient/:patientId", verifyToken, IsUser, ReservationController.getDetailbyPatient);


module.exports = router;
