const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const { hash, compare } = require("bcryptjs");

class UsersController {
  async create(req, res) {
    const { name, email, password } = req.body;

    const database = await sqliteConnection();
    const emailExists = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (emailExists) {
      throw new AppError("Este endereço de email já está cadastrado.", 409);
    }

    if(password.length < 6) {
      throw new AppError("A sua senha deve conter no mínimo 6 caracteres.")
    }

    const hashedPassword = await hash(password, 8);

    database.run(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return res.status(201).json("Usuário cadastrado!");
  }

  async update(req, res) {
    const { name, email, old_password, password } = req.body;
    const user_id = req.user.id;

    const database = await sqliteConnection();
    const user = await database.get("SELECT * FROM users WHERE id = (?)", [
      user_id,
    ]);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const updateEmail = await database.get(
      "SELECT * FROM users WHERE email = (?)",
      [email]
    );

    if (updateEmail && updateEmail.id !== user.id) {
      throw new AppError("Este email já está em uso.", 404);
    }

    if ((password && !old_password) || (!password && old_password)) {
      throw new AppError(
        "Você precisa informar a senha antiga para definir uma nova senha.",
        400
      );
    }

    if (password && old_password) {
      const checkPassword = await compare(old_password, user.password);
      if (!checkPassword) {
        throw new AppError("A senha antiga não confere.", 401);
      }
      user.password = await hash(password, 8);
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;

    await database.run(
      `UPDATE users SET
    name = ?,
    email = ?,
    password = ?,
    updated_at = DATETIME('now')
    WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    );

    return res.status(200).json("Usuário atualizado!");
  }
}

module.exports = UsersController;
