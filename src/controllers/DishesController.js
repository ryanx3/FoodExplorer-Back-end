const AppError = require("../utils/AppError");
const sqliteConnection = require("../database/sqlite");
const knex = require("../database/knex");
const DiskStorage = require("../providers/DiskStorage");

class DishesController {
  async create(req, res) {
    try {
      const { name, category, description, price, ingredients } = req.body;
      const user_id = req.user.id;
      const image = req.file.filename;

      const diskStorage = new DiskStorage();
      const filename = await diskStorage.saveFile(image);
      const ingredientsArray = JSON.parse(ingredients || "[]");

      const database = await sqliteConnection();

      if(!req.file ) {
      throw new AppError("Selecione uma imagem para o seu prato.")
      }

      const nameExists = await database.get(
        "SELECT * FROM dishes WHERE name = (?)",
        [name]
      );
      if (nameExists) {
        throw new AppError("O nome deste prato já existe.");
      }

      if (!req.file) {
        throw new AppError("Imagem não encontrada.");
      }

      const [dish_id] = await knex("dishes").insert({
        name,
        category,
        description,
        price,
        image: filename,
        user_id,
      });

      const ingredientsInsert = ingredientsArray.map((ingredient) => {
        return {
          dish_id,
          ingredient,
          user_id,
        };
      });

      await knex("ingredients").where({ dish_id }).insert(ingredientsInsert);

      return res.json("Prato Criado");
    } catch (error) {
      throw new AppError(error.message || "Erro ao criar este prato.");
    }
  }

  async show(req, res) {
    try {
      const { dish_id } = req.params;

      const dish = await knex("dishes").where({ id: dish_id }).first();
      const ingredients = await knex("ingredients")
        .where({ dish_id })
        .orderBy("ingredient");

      if (!dish) {
        throw new AppError("Prato não encontrado.", 404);
      }

      return res.json({
        ...dish,
        ingredients,
      });
    } catch (error) {
      throw new AppError("Erro ao mostrar o prato.");
    }
  }

  async delete(req, res) {
    const { dish_id } = req.params;
    await knex("dishes").where({ id: dish_id }).delete();

    return res.json("Prato excluído!");
  }

  async index(req, res) {
    const { name, ingredients } = req.query;
    const user_id = req.user.id;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients
        .split(",")
        .map((ingredient) => ingredient.trim());

      dishes = await knex("ingredients")
        .select(["dishes.id", "dishes.name", "dishes.user_id"])
        .where("dishes.user_id", user_id)
        .whereLike("dishes.name", `%${name}%`)
        .whereIn("ingredient", filterIngredients)
        .innerJoin("dishes", "dishes.id", "ingredients.dish_id");
    } else {
      dishes = await knex("dishes")
        .where({ user_id })
        .whereLike("name", `%${name}%`)
        .orderBy("name");
    }

    const userIngredients = await knex("ingredients").where({ user_id });

    const dishWithIngredients = dishes.map((dish) => {
      const dishIngredients = userIngredients.filter(
        (ingredient) => ingredient.dish_id === dish.id
      );

      return {
        ...dish,
        ingredients: dishIngredients,
      };
    });

    return res.json(dishWithIngredients);
  }

  async update(req, res) {
    try {
      const { name, category, description, price, ingredients } = req.body;
      const { dish_id } = req.params;

      const database = await sqliteConnection();

      const nameExists = await database.get(
        "SELECT * FROM dishes WHERE name = ( ? )AND id <> (?)",
        [name, dish_id]
      );
      if (nameExists) {
        throw new AppError("O nome deste prato já existe.");
      }

      const user = await knex("dishes")
        .where({ id: dish_id })
        .select("user_id")
        .first();

      await knex("dishes").where({ id: dish_id }).update({
        name,
        category,
        description,
        price,
        user_id: user.user_id,
        updated_by: user.user_id,
      });

      await knex("ingredients").where({ dish_id }).del();

      const newIngredientsInsert = ingredients.map((ingredient) => {
        return {
          dish_id,
          ingredient,
          user_id: user.user_id,
        };
      });

      await knex("ingredients").insert(newIngredientsInsert);

      return res.status(200).json("Prato atualizado!");
    } catch (error) {
      console.error("Erro ao atualizar este prato.", error);
      throw new AppError(error.message || "Erro ao atualizar este prato.");
    }
  }
}

module.exports = DishesController;
