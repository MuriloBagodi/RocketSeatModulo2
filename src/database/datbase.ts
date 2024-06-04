import * as knexPkg from 'knex';
import { Knex } from "knex"
import { env } from "../env"

const { knex } = knexPkg.default;

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: env.DATABASE_CLIENT === "sqlite" ? {
        filename: env.DATABASEURL
    } : env.DATABASEURL,
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./tmp/migrations"
    }
}

export const setUpKnex = knex(config)
