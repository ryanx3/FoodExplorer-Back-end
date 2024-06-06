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
    try {
      const { dish_id } = req.params;
      const imageFilename = req.file.filename;

      const diskStorage = new DiskStorage();
      const dish = await knex("dishes").where({ id: dish_id }).first();

      if (!dish) {
        return res.status(404).json({ error: "Prato não encontrado." });
      }

      if (dish.image) {
        await diskStorage.deleteFile(dish.image);
      }

      const filename = await diskStorage.saveFile(imageFilename);

      await knex("dishes").where({ id: dish_id }).update({ image: filename });
      
      return res.json({ image: filename });
    } catch (error) {
      throw new AppError("Erro ao atualizar imagem.");
    }
  }
}

module.exports = FilesController;
