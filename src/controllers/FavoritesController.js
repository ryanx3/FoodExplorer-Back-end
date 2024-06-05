const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class FavoritesController {
  async create(req, res) {
    const user_id = req.user.id;
    const { dish_id } = req.params;

    const [id] = await knex("favoriteDishes").insert({
      dish_id,
      user_id,
    });
    if (!id) {
      throw new AppError("Não foi possível favoritar o prato", 401);
    }

    return res.json("Prato favoritado com sucesso");
  }

  async delete(req, res) {
      const user_id = req.user.id
    const { dish_id } = req.params

    const usersFavoriteDishes = await knex("favoriteDishes").where({ user_id })

    let dishIdFavorites

    for (let i = 0; i < usersFavoriteDishes.length; i++) {
      if (usersFavoriteDishes[i].dish_id == dish_id) {
        dishIdFavorites = usersFavoriteDishes[i].id
      }
    }

    if (dishIdFavorites) {
      await knex("favoriteDishes").where({ id: dishIdFavorites }).delete()
    } else {
      throw new AppError("Não foi possível localizar o prato favorito")
    }

    return res.json({ message: "Prato favorito deletado com sucesso" })
  }

  async index(req, res) {
    const user_id = req.user.id
    const { role } = req.user

    if (role === "customer") {
      const usersFavoriteDishes = await knex("favoriteDishes").where({
        user_id,
      })

      if (usersFavoriteDishes) {
        return res.json(usersFavoriteDishes)
      } else {
        throw new AppError("Não foi possível localizar os pratos favoritos")
      }
    } else {
      const dishesFavorites = await knex("favoriteDishes").orderBy("dish_id")

      const count = {}
      dishesFavorites.forEach((object) => {
        const dish_id = object.dish_id

        if (count[dish_id]) {
          count[dish_id].amount++
        } else {
          count[dish_id] = {
            ...object,
            amount: 1,
          }
        }
      })

      const newArray = Object.values(count).map((item) => item)

      if (!newArray) {
        throw new AppError("Não foi possível localizar os pratos favoritos")
      }
      return res.json(newArray)
    }
  }
}

module.exports = FavoritesController