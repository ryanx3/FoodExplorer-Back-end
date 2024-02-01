const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfigs = require("../configs/auth");

function ensureAuthenticated(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new AppError("JWT Token não informado.", 401);
  }

  const [, token] = authorization.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfigs.jwt.secret);

    req.user = {
      id: Number(user_id),
    };

    return next()
  } catch {
    throw new AppError("JWT Token inválido.", 401);
  }
}


module.exports = ensureAuthenticated