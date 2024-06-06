const { Router } = require("express");
const usersRouter = Router();

const uploadConfig = require("../configs/upload");
const multer = require("multer");

const UsersController = require("../controllers/UsersController");
const usersController = new UsersController();
const FilesController = require("../controllers/FilesController");
const filesController = new FilesController();

const upload = multer(uploadConfig.MULTER);
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

usersRouter.post("/", usersController.create);
usersRouter.put("/", ensureAuthenticated, usersController.update);
usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  filesController.updateUserAvatar
);

module.exports = usersRouter;
