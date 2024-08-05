const router = require("express").Router();
const verifyToken = require("../middlewares/VerifyToken");
const AuthController = require("../controllers/AuthController.js");
const PatientController = require("../controllers/PatientController.js");
const ReservationController = require("../controllers/ReservationController.js");
const TransactionController = require("../controllers/TransactionController.js");

const { IsAdmin, IsPatient } = require("../middlewares/chekRole.js");
const UserController = require("../controllers/UserController.js");
const ServiceController = require("../controllers/ServiceController.js");
const MedicalRecordController = require("../controllers/MedicalRecordController.js");
const {
  validationCreatePatient,
  validationUpdatePatient,
} = require("../middlewares/Validator.js");
const JadwalDokterController = require("../controllers/JadwalDokterController.js");

router.post("/register-patient", PatientController.createPatient);
router.post("/admin/login", AuthController.LoginAdmin);
router.post("/patient/login", AuthController.LoginPatient);
// router.post("/register", AuthController.register);
router.get("/fetch", verifyToken, AuthController.Fetch);

router.get(
  "/amount-dashboard",
  verifyToken,

  UserController.amountDashboard
);
router.get("/role", verifyToken, UserController.getRole);
router.post(
  "/user-management",
  verifyToken,

  UserController.createUser
);
router.get("/user-management", verifyToken, UserController.getUser);
router.get(
  "/user-management/:id",
  verifyToken,

  UserController.getUserById
);
router.put(
  "/user-management/:id",
  verifyToken,

  UserController.updateUser
);
router.delete(
  "/user-management/:id",
  verifyToken,

  UserController.deleteUser
);

router.post(
  "/medical-record",
  verifyToken,
  MedicalRecordController.createMedicalRecord
);
router.get(
  "/medical-record",
  verifyToken,
  MedicalRecordController.getMedicalRecord
);
router.put(
  "/medical-record/:id",
  verifyToken,
  MedicalRecordController.updateMedicalRecord
);
router.get(
  "/medical-record/:id",
  verifyToken,
  MedicalRecordController.detailMedicalRecord
);

router.get("/dokter", verifyToken, JadwalDokterController.getDokter);
router.post(
  "/jadwal-dokter",
  verifyToken,
  
  JadwalDokterController.createJadwalDokter
);
router.put(
  "/jadwal-dokter/:id",
  verifyToken,
  
  JadwalDokterController.updateJadwalDokter
);
router.get("/jadwal-dokter", JadwalDokterController.getJadwalDokter);
router.get(
  "/jadwal-dokter/:id",
  verifyToken,
  JadwalDokterController.getDetailJadwalDokter
);
router.delete(
  "/jadwal-dokter/:id",
  verifyToken,
  
  JadwalDokterController.deleteJadwalDokter
);

router.get("/patient", verifyToken, PatientController.getPatient);
router.get(
  "/patient/:id",
  verifyToken,
  
  PatientController.detailPatient
);
router.put(
  "/patient/:id",
  verifyToken,
  // validationUpdatePatient(),
  PatientController.updatePatient
);
// router.put("/userId-patient/:id", verifyToken, IsUser,PatientController.updateUserId);
router.get("/check-patient", verifyToken, PatientController.chekPatient);
router.delete(
  "/patient/:id",
  verifyToken,
  
  PatientController.deletePatient
);

router.post(
  "/reservation",
  verifyToken,
  ReservationController.createReservation
);
router.get(
  "/reservation",
  verifyToken,
  ReservationController.getAllReservation
);
router.delete(
  "/reservation/:id",
  verifyToken,
  ReservationController.deleteReservation
);
router.get(
  "/reservation/:id",
  verifyToken,
  ReservationController.getDetailReservation
);

router.get(
  "/type-reservation/:type",
  verifyToken,
  ReservationController.getReservation
);
router.post("/service", verifyToken,  ServiceController.createService);
router.put(
  "/service/:id",
  verifyToken,
  
  ServiceController.updateService
);
router.get("/service", verifyToken, ServiceController.getService);
router.get("/transaction", verifyToken, TransactionController.getTransaction);
router.get(
  "/transaction/:type",
  verifyToken,
  TransactionController.getTypeTransaction
);

router.get(
  "/invoice-obat/:id",
  verifyToken,
  TransactionController.getInvoiceObat
);
// router.get("/reservation-patient/:patientId", verifyToken, IsUser, ReservationController.getDetailbyPatient);

module.exports = router;
