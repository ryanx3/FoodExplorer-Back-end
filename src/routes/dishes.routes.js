const Router = require("express");
const dishesRouter = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const FilesController = require("../controllers/FilesController");
const filesController = new FilesController();

const upload = multer(uploadConfig.MULTER);

dishesRouter.use(ensureAuthenticated);
dishesRouter.post("/", upload.single("image"), dishesController.create);
dishesRouter.get("/:dish_id", dishesController.show);
dishesRouter.delete("/:dish_id", dishesController.delete);
dishesRouter.put("/:dish_id", dishesController.update);
dishesRouter.get("/", dishesController.index);

module.exports = dishesRouter;
