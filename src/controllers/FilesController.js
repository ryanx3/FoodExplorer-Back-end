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

  async UpdateDishImage(req, res) {
    try {
      const { dish_id } = req.params;
      const imageFilename = req.file.filename;

      const diskStorage = new DiskStorage();
      const filename = await diskStorage.saveFile(imageFilename);

      await knex("dishes").where({ id: dish_id }).insert({ image: filename });

      return res.json({ image: filename });
    } catch (error) {
      return res.status(500).json({ error: "Erro ao enviar a imagem." });
    }
  }
}

module.exports = FilesController;
