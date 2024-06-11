const { Router } = require("express");
const routes = Router();

const usersRouter = require("./users.routes");
const dishesRouter = require("./dishes.routes");
const sessionsRouter = require("./sessions.routes");
const ingredientsRouter = require("./ingredients.routes");
const favoritesRouter = require("./favorites.routes");
const userAddressRouter = require("./userAddress.routes");
const checkoutRouter = require("./checkout.routes");

routes.use("/users", usersRouter);
routes.use("/dishes", dishesRouter);
routes.use("/ingredients", ingredientsRouter);
routes.use("/favorites", favoritesRouter);
routes.use("/user-address", userAddressRouter);
routes.use("/sessions", sessionsRouter);
routes.use("/checkout", checkoutRouter);

module.exports = routes;
