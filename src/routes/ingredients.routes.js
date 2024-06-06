const { Router } = require("express");
const ingredientsRouter = Router();

const IngredientsController = require("../controllers/IngredientsController");
const ingredientsController = new IngredientsController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

ingredientsRouter.get("/", ensureAuthenticated, ingredientsController.index);

module.exports = ingredientsRouter;
