const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class UsersValidatedController {
  async index(req, res) {
    const { user } = req;

    const checkUserExists = await knex("users").where({ id: user.id });

    if (checkUserExists.length === 0) {
      throw new AppError("Não autorizado.", 401);
    }

    return res.status(200).json();
  }
}

module.exports = UsersValidatedController;
