const Router = require("express");
const favoritesRouter = Router();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const FavoritesController = require("../controllers/FavoritesController");
const favoritesController = new FavoritesController();

favoritesRouter.use(ensureAuthenticated);

favoritesRouter.post("/:dish_id", favoritesController.create);
favoritesRouter.delete("/:dish_id", favoritesController.delete);
favoritesRouter.get("/", favoritesController.index);
