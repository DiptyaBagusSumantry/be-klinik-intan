const Models = require("../models/index.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const { accesToken } = require("../helper/chekAccessToken.js");
const { handlerError, handleCreate } = require("../helper/HandlerError.js");

const User = Models.User;

class AuthController {
  static async LoginAdmin(req, res) {
    try {
      //scope show password setting in models
      const user = await User.scope("visiblePassword").findOne({
        include: { model: Models.Role },
        where: {
          [Op.or]: { username: req.body.username, phone: req.body.username },
        },
      });

      if (!user)
        return res.status(400).json({ msg: "username tidak ditemukan" });
      //check password
      const match = await bcrypt.compare(req.body.password, user.password);
      if (!match) return res.status(400).json({ msg: "password anda salah" });

      //acces token expreid in 8 jam
      const accessToken = jwt.sign(
        {
          id: user.id,
          role: user.role.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "5760m", //detik expreid 5 menit
        }
      );
      res.status(200).json({
        accessToken: accessToken,
        role: user.role.name,
        fullname: user.fullname,
      });
    } catch (error) {
      handlerError(res, error);
    }
  }
  static async LoginPatient(req, res) {
    try {
      // //scope show password setting in models
      // const user = await User.scope("visiblePassword").findOne({
      //   include: { model: Models.Role },
      //   where: {
      //     [Op.or]: { username: req.body.username, phone: req.body.username },
      //   },
      // });
      const patient = await Models.Patient.findOne({
        where: {
          no_rm: req.body.no_rm,
          nik: req.body.nik,
        },
      });

      if (!patient)
        return res
          .status(400)
          .json({ msg: "no rekam medis atau nik tidak ditemukan" });
      //check password
      // const match = await bcrypt.compare(req.body.password, user.password);
      // if (!match) return res.status(400).json({ msg: "password anda salah" });

      //acces token expreid in 8 jam
      const accessToken = jwt.sign(
        {
          id: patient.id,
          role: "patient",
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "5760m", //detik expreid 5 menit
        }
      );
      res.status(200).json({
        accessToken: accessToken,
        role: "Patient",
        fullname: patient.fullname,
      });
    } catch (error) {
      handlerError(res, error);
    }
  }

  static async Fetch(req, res) {
    try {
      const user = accesToken(req);
      let fetch;
      if (user.role == "patient") {
        await Models.Patient.findOne({
          where: { id: user.id },
        }).then((data) => {
          fetch = {
            username: data.fullname,
            role: user.role,
          };
        });
      } else {
        await User.findOne({
          where: { id: user.id },
        }).then((data) => {
          fetch = {
            username: data.username,
            role: user.role,
          };
        });
      }
      return res.status(200).json(fetch);
    } catch (error) {
      handlerError(res, error);
    }
  }

  // static async register(req, res) {
  //   try {
  //     const { username, password, fullname, phone, email } = req.body;
  //     const role = await Models.Role.findOne({where: {name: "user"}})

  //     await Models.User.create({
  //       username,
  //       password,
  //       fullname,
  //       phone,
  //       email,
  //       roleId: role.id,
  //     });
  //     handleCreate(res);
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
}

module.exports = AuthController;
