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
    const token = sign({ role: user.role }, secret, {
      subject: String(user.id),
      expiresIn,
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 1000,
    });

    delete user.password;

    return res.status(201).json({ user });
  }
}

module.exports = SessionsController;
