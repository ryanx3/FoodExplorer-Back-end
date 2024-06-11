exports.up = (knex) =>
  knex.schema.createTable("order_checkout", (table) => {
    table.increments("id");
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .enum("paymentType", ["creditCard", "pix"], {
        useNative: true,
        enumName: "typesOfPayments",
      })
      .notNullable();
    table.float("total_payment");
    table.boolean("orderCompleted").default(false);
    table.timestamp("created_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("order_checkout");
