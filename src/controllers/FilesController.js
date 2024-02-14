const { diskStorage } = require("multer");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class FilesController {
  async updateUserAvatar(req, res) {
    const user_id = req.user.id;
    const avatarFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const user = await knex("users").where({ id: user_id }).first();

    if (!user) {
      throw new AppError("Apenas usuários autenticados podem ter um avatar.");
    }

    if (user.avatar) {
      await diskStorage.deleteFile(user.avatar);
    }

    const filename = await diskStorage.saveFile(avatarFilename);

    user.avatar = filename;

    await knex("users").where({ id: user_id }).update(user);

    return res.json(user);
  }

  async updateDishImage(req, res) {
    const { dish_id } = req.params;
    const imageFilename = req.file.filename;

    const diskStorage = new DiskStorage();

    const dish = await knex("dishes").where({ id: dish_id }).first();

    if (!dish) {
      throw new AppError("Este prato não existe.");
    }

    if (dish.image) {
      await diskStorage.deleteFile(imageFilename);
    }

    const image = await diskStorage.saveFile(imageFilename);

    dish.image = image;

    await knex("dishes").where({ id: dish_id }).update(dish);

    return res.json({ dish });
  }
}

module.exports = FilesController;
