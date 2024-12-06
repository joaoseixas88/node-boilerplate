import cuid from "cuid";
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table
      .string("id")
      .primary()
      .defaultTo(knex.raw(`'${cuid()}'`));
    table.string("email").unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
