const Router = require("express");
const cartRouter = Router();

const CartController = require("../controllers/CartController");
const cartController = new CartController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

cartRouter.use(ensureAuthenticated)

cartRouter.post("/", cartController.create)
cartRouter.delete("/", cartController.delete)
cartRouter.get("/", cartController.show)

module.exports = cartRouter