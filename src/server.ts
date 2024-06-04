import { app } from "./app"
import { env } from "./env"
const port = env.PORT  || 3333

try {
    app.listen({ port }).then(() => {
        console.log("HTTP Server Running on: ", port)
    })
} catch {
    console.log("HTTP Server is not Running")
}
