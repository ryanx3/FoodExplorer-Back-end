exports.up = (knex) =>
  knex.schema.createTable("userAdress", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("cep");
    table.text("street");
    table.text("number");
    table.text("city");
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("userAdress");
