const { Sequelize, Op } = require("sequelize");

function searchWhere(search, column1, column2, column3) {
  whereClause = {
    [Op.and]: [
      {
        [Op.or]: [
          Sequelize.where(Sequelize.fn("lower", Sequelize.col(`${column1}`)), {
            [Op.like]: `%${search.toLowerCase().replace("%20", " ")}%`,
          }),
          Sequelize.where(Sequelize.fn("lower", Sequelize.col(`${column2}`)), {
            [Op.like]: `%${search.toLowerCase().replace("%20", " ")}%`,
          }),
        ],
      },
    ],
  };
  return whereClause;
}
function searchWhereCheck(search1,search2, column1, column2, column3) {
  whereClause = {
    [Op.and]: [
      Sequelize.where(Sequelize.fn("lower", Sequelize.col(`${column1}`)), {
        [Op.like]: `%${search1.toLowerCase().replace("%20", " ")}%`,
      }),
      Sequelize.where(Sequelize.fn("lower", Sequelize.col(`${column2}`)), {
        [Op.like]: `%${search2.toLowerCase().replace("%20", " ")}%`,
      }),
    ],
  };
  return whereClause;
}

module.exports = { searchWhere, searchWhereCheck };
