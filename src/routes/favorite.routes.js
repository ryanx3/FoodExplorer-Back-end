const { Router } = require("express");
const favoritesRouter = Router();

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const FavoritesController = require("../controllers/FavoritesController");
const favoritesController = new FavoritesController();


favoritesRouter.post("/:dish_id", ensureAuthenticated, favoritesController.create);
favoritesRouter.delete("/:dish_id", favoritesController.delete);
favoritesRouter.get("/", favoritesController.index);

module.exports = favoritesRouter
