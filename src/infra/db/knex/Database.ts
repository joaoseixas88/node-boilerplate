import Env from "@/Env";
import knex, { Knex } from "knex";

const Database = knex({
  client: "postgres",
  connection: process.env.DATABASE_URL,
  debug: Env.NODE_ENV !== "production",
});

knex.QueryBuilder.extend("if", function (
  condition: boolean,
  callback: (query: Knex.QueryBuilder) => void
) {
  if (condition) {
    callback(this);
  }
  return this;
});
knex.QueryBuilder.extend("findByColumnLikeInsensitive", function (
  columnName: string,
  value: string | undefined | null
) {
  if (value === undefined || value === null) return this;
  this.whereRaw(`lower(${columnName}) like ?`, [`%${value.toLowerCase()}%`]);
  return this;
});

export default Database;
