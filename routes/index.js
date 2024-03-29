const router = require("express").Router();
const verifyToken = require("../middlewares/VerifyToken");
const AuthController = require("../controllers/AuthController.js");
const PatientController = require("../controllers/PatientController.js");
const ReservationController = require("../controllers/ReservationController.js");
const TransactionController = require("../controllers/TransactionController.js");

const { IsAdmin, IsUser } = require("../middlewares/chekRole.js");
const UserController = require("../controllers/UserController.js");
const ServiceController = require("../controllers/ServiceController.js");
const { validationCreatePatient, validationUpdatePatient } = require("../middlewares/Validator.js");

router.post("/login", AuthController.Login);
// router.post("/register", AuthController.register);
router.get("/fetch", verifyToken, AuthController.Fetch);

router.post("/patient", validationCreatePatient(), PatientController.createPatient);
router.get("/patient", verifyToken, PatientController.getPatient);
router.get("/patient/:id", verifyToken, IsAdmin, PatientController.detailPatient);
router.put("/patient/:id", verifyToken, validationUpdatePatient(),PatientController.updatePatient);
// router.put("/userId-patient/:id", verifyToken, IsUser,PatientController.updateUserId);
router.get("/check-patient", verifyToken, PatientController.chekPatient);

router.post("/reservation", verifyToken, ReservationController.createReservation);
router.get("/reservation/:id", verifyToken, ReservationController.getDetailReservation);

// router.get("/user", verifyToken, IsAdmin, UserController.getUser);
router.get("/reservation", verifyToken, ReservationController.getReservation);
router.post("/service", verifyToken, IsAdmin, ServiceController.createService);
router.get("/service", verifyToken, ServiceController.getService);
router.get("/transaction", verifyToken, TransactionController.getTransaction);


// router.get("/reservation-patient/:patientId", verifyToken, IsUser, ReservationController.getDetailbyPatient);


module.exports = router;
