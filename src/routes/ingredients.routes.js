const Router = require("express")

const ingredientsRouter = Router()

const IngredientsController = require("../controllers/IngredientsController")
const ingredientsController = new IngredientsController()

ingredientsRouter.get("/:user_id", ingredientsController.index)

module.exports = ingredientsRouter