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

      return res.status(200).json("Prato favoritado com sucesso!");
    } catch (error) {
      console.error(error.message);
      return res.status(500).json("Erro interno do servidor");
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

    try {
      const AllCustomerFavoriteDishes = await knex("favorites")
        .join("dishes", "favorites.dish_id", "dishes.id")
        .where("favorites.user_id", user_id)
        .select("dishes.*");

      return res.json(AllCustomerFavoriteDishes);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }

  async show(req, res) {
    try {
      const topFavoriteDishes = await knex("favorites")
        .join("dishes", "favorites.dish_id", "dishes.id")
        .select("dishes.id", "dishes.name")
        .count("favorites.dish_id as favorites_count")
        .groupBy("dishes.id", "dishes.name")
        .orderBy("favorites_count", "desc")
        .limit(5);

      return res.json(topFavoriteDishes);
    } catch (error) {
      console.error(error.message);
      return res.status(500).json({ error: "Erro interno do servidor" });
    }
  }
}

module.exports = FavoritesController;
