const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class FavoritesController {
  async create(req, res) {
    const { dish_id } = req.params;
    const user_id = req.user.id;

    try {
      const [id] = await knex("favorites").insert({
        dish_id,
        user_id,
      });
      if (!id) {
        throw new AppError("Não foi possível favoritar o prato", 401);
      }

      return res.json("Prato favoritado com sucesso!");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async delete(req, res) {
    const { dish_id } = req.params;
    const user_id = req.user.id;

    try {
      const deleted = await knex("favorites").where({ dish_id, user_id }).del();

      if (!deleted) {
        throw new AppError("Prato favorito não encontrado para exclusão", 404);
      }

      return res.json({ message: "Prato desfavoritado com sucesso!" });
    } catch (error) {
      console.error(error.message);
      return res
        .status(error.status || 500)
        .json({ error: "Erro interno do servidor" });
    }
  }

  async index(req, res) {
    const user_id = req.user.id;

    if (role === "customer") {
      const usersFavoriteDishes = await knex("favorites").where({
        user_id,
      });

      if (usersFavoriteDishes) {
        return res.json(usersFavoriteDishes);
      } else {
        throw new AppError("Não foi possível localizar os pratos favoritos");
      }
    } else {
      const dishesFavorites = await knex("favorites").orderBy("dish_id");

      const count = {};
      dishesFavorites.forEach((object) => {
        const dish_id = object.dish_id;

        if (count[dish_id]) {
          count[dish_id].amount++;
        } else {
          count[dish_id] = {
            ...object,
            amount: 1,
          };
        }
      });

      const newArray = Object.values(count).map((item) => item);

      if (!newArray) {
        throw new AppError("Não foi possível localizar os pratos favoritos");
      }
      return res.json(newArray);
    }
  }
}

module.exports = FavoritesController