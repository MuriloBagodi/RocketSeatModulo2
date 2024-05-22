import { app } from "./app"
import { env } from "./env"

try {
    app.listen({ port: env.PORT }).then(() => {
        console.log("HTTP Server Running")
    })
} catch {
    console.log("HTTP Server is not Running")
}
