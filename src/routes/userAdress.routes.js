const { Router } = require("express");
const routerUserAdress = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const UserAdressController = require("../controllers/UserAdressController");
const userAdressController = new UserAdressController();

routerUserAdress.put("/", ensureAuthenticated, userAdressController.update);

module.exports = routerUserAdress;