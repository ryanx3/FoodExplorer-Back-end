const { Router } = require("express");
const dishesRouter = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const DishesController = require("../controllers/DishesController");
const dishesController = new DishesController();
const FilesController = require("../controllers/FilesController");
const filesController = new FilesController();

const upload = multer(uploadConfig.MULTER);

const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

dishesRouter.use(ensureAuthenticated);

dishesRouter.get("/:dish_id", dishesController.show);
dishesRouter.get("/", dishesController.index);

dishesRouter.post(
  "/",
  verifyUserAuthorization(["admin"]),
  dishesController.create
);
dishesRouter.delete(
  "/:dish_id",
  verifyUserAuthorization(["admin"]),
  dishesController.delete
);
dishesRouter.put(
  "/:dish_id",
  verifyUserAuthorization(["admin"]),
  dishesController.update
);
dishesRouter.patch(
  "/:dish_id/image",
  verifyUserAuthorization(["admin"]),
  upload.single("image"),
  filesController.updateDishImage
);

module.exports = dishesRouter;
