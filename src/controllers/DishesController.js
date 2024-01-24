const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const knex = require("../database/knex");
class DishesController {
  async create(req, res) {
    try {
      const { name, category, description, price, ingredients } = req.body;
      const { admin_id } = req.params;

      const database = await sqliteConnection();

      const userIsAdmin = await database.get(
        "SELECT isAdmin FROM users WHERE id = ? AND (isAdmin = 0 OR isAdmin IS NULL)",
        [admin_id]
      );
      if (userIsAdmin) {
        throw new AppError("Apenas administradores podem criar um prato.", 404);
      }

      const nameExists = await database.get(
        "SELECT * FROM dishes WHERE name = (?)",
        [name]
      );
      if (nameExists) {
        throw new AppError("O nome deste prato já existe.");
      }

      if (isNaN(price) || price <= 0) {
        throw new AppError("Preço inválido.");
      }

      const [dish_id] = await knex("dishes").insert({
        name,
        category,
        description,
        price,
        created_by: admin_id,
      });

      const ingredientsInsert = ingredients.map((ingredient) => {
        return {
          dish_id,
          ingredient,
          created_by: admin_id,
        };
      });

      await knex("ingredients").insert(ingredientsInsert);
      res.status(200).json("Prato criado!");
    } catch (error) {
      throw new AppError("Erro ao criar este prato.");
    }
  }

  async show(req, res) {}

  async update(req, res) {
    try {
      const { name, category, description, price, ingredients } = req.body;
      const { admin_id } = req.params;
      const database = await sqliteConnection();

      const user = await database.get("SELECT * FROM users WHERE id = (?)", [
        admin_id,
      ]);
      if (!user) {
        throw new AppError("Usuário não encontrado.", 404);
      }

      res.status(200).json("Prato atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar este prato.", error);
      throw new AppError(error.message || "Erro ao atualizar este prato.");
    }
  }
  async delete(req, res) {}
}

module.exports = DishesController;
