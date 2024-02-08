const knex = require("../database/knex");

class IngredientsController {
    async index(req, res) {
        const  user_id  = req.user.id;

        const ingredients = await knex("ingredients").where({ user_id }).groupBy("ingredient")

        return res.json(ingredients)
    }
}

module.exports = IngredientsController  