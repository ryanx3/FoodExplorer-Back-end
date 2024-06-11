const Router = require("express");
const checkoutRouter = Router();

const CheckoutController = require("../controllers/CheckoutController");
const checkoutController = new CheckoutController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

checkoutRouter.use(ensureAuthenticated);

checkoutRouter.post("/", checkoutController.create);
checkoutRouter.delete("/", checkoutController.delete);
checkoutRouter.get("/", checkoutController.show);

module.exports = checkoutRouter;