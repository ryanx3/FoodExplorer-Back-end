exports.up = (knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id");
    table
      .enum("role", ["admin", "customer"], {
        useNative: true,
        enumName: "roles",
      })
      .notNullable()
      .default("customer");

    table.text("name");
    table.text("email");
    table.text("password");
    table.text("avatar").defaultTo(null);

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("users");
