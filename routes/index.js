const router = require("express").Router();
const verifyToken = require("../middlewares/VerifyToken");
const AuthController = require("../controllers/AuthController.js");
const MedicineController = require("../controllers/MedicineController.js");
const PatientController = require("../controllers/PatientController.js");
const ReservationController = require("../controllers/ReservationController.js");
const TransactionController = require("../controllers/TransactionController.js");

const { IsAdmin } = require("../middlewares/chekRole.js");
const UserController = require("../controllers/UserController.js");

router.post("/login", AuthController.Login);
router.post("/register", AuthController.register);
router.get("/fetch", verifyToken, AuthController.Fetch);

router.post("/patient", verifyToken, PatientController.createPatient);
router.get("/patient", verifyToken, PatientController.getPatient);

//ADMIN
router.get("/user", verifyToken, IsAdmin, UserController.getUser);


//USER

module.exports = router;
