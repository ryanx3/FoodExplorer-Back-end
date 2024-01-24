const Router = require("express")
const dishesRouter = Router()

const DishesController = require("../controllers/DishesController")
const dishesController = new DishesController()

dishesRouter.post("/:admin_id", dishesController.create )
dishesRouter.put("/:admin_id", dishesController.update )

module.exports = dishesRouter