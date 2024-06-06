const { Router } = require("express");
const routerUserAdress = Router();

const UserAdressController = require("../controllers/UserAdressController");
const userAdressController = new UserAdressController();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

routerUserAdress.put("/", ensureAuthenticated, userAdressController.update);

module.exports = routerUserAdress;