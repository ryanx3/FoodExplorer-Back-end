const { Router } = require("express");
const userAddressRouter = Router();

const UserAddressController = require("../controllers/UserAddressController");
const userAddressController = new UserAddressController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

userAddressRouter.put("/", ensureAuthenticated, userAddressController.update);
userAddressRouter.get("/", ensureAuthenticated, userAddressController.index);

module.exports = userAddressRouter;
