const { where } = require("sequelize");
const {
  handlerError,
  handleGet,
  handleGetPaginator,
} = require("../helper/HandlerError.js");
const { paginator } = require("../helper/Pagination.js");
const { searchWhere } = require("../helper/Search.js");
const Models = require("../models/index.js");
const User = Models.User;

class UserController {
  static async amountDashboard(req,res){
    try {
      // const getRole = await Models.Role.findAll()
      // return res.send(getRole)
      const amount_patient = await Models.Patient.count()
      const amount_medical_record = await Models.Reservation.count()
      const amount_docter = await Models.User.count({
        include: {
          model: Models.Role,
          where: {name: 'docter'}
        }
      })
      const amount_service = await Models.Service.count()
      const amount_user = await Models.User.count()
      
      handleGet(res, {amount_patient, amount_medical_record, amount_docter, amount_service, amount_user})
    } catch (error) {
      handlerError(res, error);
    }
  }
  // static async getUser(req, res) {
  //   try {
  //     const { page, search, sorting } = req.query;
  //     let whereClause = {
  //       include: { model: Models.Role, where: { name: "user" } },
  //     };
  //     //sorting
  //     whereClause.order = [["fullname", sorting ? sorting : "ASC"]];
  //     //searching
  //     if (search) {
  //       whereClause.where = searchWhere(search, "fullname", "phone");
  //     }

  //     await User.findAll(whereClause).then((data) => {
  //       handleGetPaginator(res, paginator(data, page ? page : 1, 20));
  //     });
  //   } catch (error) {
  //     handlerError(res, error);
  //   }
  // }
}

module.exports = UserController;
