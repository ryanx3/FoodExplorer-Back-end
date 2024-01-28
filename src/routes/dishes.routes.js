const Router = require("express")
const dishesRouter = Router()

const DishesController = require("../controllers/DishesController")
const dishesController = new DishesController()

dishesRouter.post("/:user_id", dishesController.create )
dishesRouter.get("/:dish_id", dishesController.show )
dishesRouter.get("/", dishesController.index )
dishesRouter.delete("/:dish_id", dishesController.delete )
dishesRouter.put("/:dish_id", dishesController.update )


module.exports = dishesRouter