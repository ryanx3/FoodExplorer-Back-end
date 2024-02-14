const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const authConfigs = require("../configs/auth");
const { sign } = require("jsonwebtoken");
const { compare } = require("bcryptjs");

class SessionsController {
  async create(req, res) {
    const { email, password } = req.body;

    const user = await knex("users").where("email", email).first();

    if (!user) {
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new AppError("Email e/ou senha incorretos.", 401);
    }

    const { expiresIn, secret } = authConfigs.jwt;
    const token = sign({}, secret, {
      subject: String(user.id),
      expiresIn,
    });

    return res.json({ user, token });
  }
}

module.exports = SessionsController;
