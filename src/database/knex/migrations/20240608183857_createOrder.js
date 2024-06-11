exports.up = (knex) =>
  knex.schema.createTable("order_items", (table) => {
    table.increments("id");
    table
      .integer("order_id")
      .references("id")
      .inTable("order_checkout")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("dish_id")
      .references("id")
      .inTable("dishes")
      .onDelete("CASCADE");
    table.integer("quantity").notNullable();
    table.timestamp("created_at");
  });

exports.down = (knex) => knex.schema.dropTable("order_items");
