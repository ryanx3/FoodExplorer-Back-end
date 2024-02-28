exports.up = (knex) =>
  knex.schema.createTable("dishes", (table) => {
    table.increments("id").primary();
    table.integer("user_id").references("id").inTable("users");

    table.text("image");
    table.text("name").notNullable().unique();
    table.text("category").notNullable();
    table.text("description").notNullable();
    table.integer("price")

    table.integer("updated_by").references("id").inTable("users");
    table.timestamps(true, true);
  });

exports.down = (knex) => knex.schema.dropTable("dishes");
