import "dotenv/config"
import { z } from "zod"

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'prod']).default("prod"),
    DATABASEURL: z.string(),
    PORT:  z.number().default(3333)
})

const _env = envSchema.safeParse(process.env)

if(_env.success == false){
    console.error("invalid enviroment variable: ", _env.error.format())

    throw new Error("Invalid Enviroment variable")
}

export const env = _env.data

