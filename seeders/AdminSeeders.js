const Models = require("../models/index.js");

class AdminSeeders {
  static async createAdmin(req, res) {
    try {
      const data = await Models.Role.bulkCreate([
        { name: "Admin" },
        { name: "Patient" },
      ]);
      await Models.User.create({
        username: "Admin",
        password: "Admin1234!",
        roleId: data[0].id,
        fullname: "admin",
        phone: "085123456789",
        email: "admin@gmail.com",
      }).then((data) => {
        console.log(`Succsess Insert Data Admin! username : ${data.username}`);
      });
    } catch (error) {
      console.log(error.message);
    }
  }
}

module.exports = AdminSeeders;
