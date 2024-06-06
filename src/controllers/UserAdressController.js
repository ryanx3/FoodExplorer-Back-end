const sqliteConnection = require("../database/sqlite");
const AppError = require("../utils/AppError");

class UserAdressController {
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

    let address = await database.get(
      "SELECT * FROM userAdress WHERE user_id = ?",
      [user_id]
    );

    if (!address) {
      await database.run(
        `INSERT INTO userAdress (user_id, cep, street, number, city, updated_at)
        VALUES (?, ?, ?, ?, ?, DATETIME('now'))`,
        [user_id, cep, street, number, city]
      );
    } else {
      await database.run(
        `UPDATE userAdress SET
          cep = ?,
          street = ?,
          number = ?,
          city = ?,
          updated_at = DATETIME('now')
        WHERE user_id = ?`,
        [cep, street, number, city, user_id]
      );
    }

    return res.status(200).json("Endereço atualizado!");
  }
}

module.exports = UserAdressController;
