import { knex, type Knex } from "knex";

type Environment = "production" | "development" | "test";
const knexConfig: Record<Environment, Knex.Config> = {
  test: {
    client: "sqlite3",
    connection: {
      filename: "./dev.sqlite3",
    },
  },
  development: {
    client: "postgres",
    connection: {
      database: "dropzone_test",
      user: "root",
      password: "root",
    },
    debug: true,
    migrations: {
      tableName: "knex_migrations",
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: "dropzone",
      user: "username",
      password: "password",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations",
    },
  },
};



module.exports = knexConfig
