const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UserAddressController {
  async update(req, res) {
    const { cep, street, number, city } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = ?", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    if (!cep && !street && !number && !city) {
      return res.sendStatus(200);
    }

    const address = await database.get(
      "SELECT * FROM user_address WHERE user_id = ?",
      [user_id]
    );

    if (!address) {
      await database.run(
        `INSERT INTO user_address (user_id, cep, street, number, city, updated_at)
      VALUES (?, ?, ?, ?, ?, DATETIME('now'))`,
        [user_id, cep, street, number, city]
      );
    } else {
      await database.run(
        `UPDATE user_address SET
        cep = ?,
        street = ?,
        number = ?,
        city = ?,
        updated_at = DATETIME('now')
      WHERE user_id = ?`,
        [cep, street, number, city, user_id]
      );
    }

    return res.sendStatus(200);
  }

  async index(req, res) {
    const user_id = req.user.id;

    const address = await knex("user_address").where({ user_id }).first();
    res.json(address);
  }
}

module.exports = UserAddressController;
