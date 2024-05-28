import { FastifyInstance } from "fastify"
import { setUpKnex } from "../database/datbase"
import { z } from "zod"
import { randomUUID } from "crypto"
import { checkSessionIdExist } from "../middleware/check-session-id-exists"

export async function transactionsRoutes(app: FastifyInstance) {

    app.addHook(
        'preHandler', async function name(req, res) {
        }
    )

    app.post("/", async (req, res) => {

        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(['credit', 'debit'])
        })

        const { title, amount, type } = createTransactionBodySchema.parse(req.body)

        let session_id = req.cookies.session_id

        if (!session_id) {
            session_id = randomUUID()

            res.cookie("session_id", session_id, {
                path: "/",
                maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
            })
        }

        await setUpKnex("transactions").insert({
            id: randomUUID(),
            title,
            amount: type === "credit" ? amount : amount * -1,
            session_id
        })

        return res.status(201).send()
    })

    app.get("/", { preHandler: checkSessionIdExist }, async (req, res) => {
        const { session_id } = req.cookies

        const transactions = await setUpKnex("transactions").where("session_id", session_id).select()

        return res.status(200).send({ transactions })
    })
    app.get("/:id", { preHandler: checkSessionIdExist }, async (req, res) => {
        const { session_id } = req.cookies

        const getTransactionParamsSchema = z.object({
            id: z.string().uuid()
        })

        const { id } = getTransactionParamsSchema.parse(req.params)

        const transaction = await setUpKnex("transactions").where({ "id": id, "session_id": session_id }).first()

        return res.status(200).send({ transaction })
    })

    app.get("/summary", { preHandler: checkSessionIdExist }, async (req, res) => {
        const { session_id } = req.cookies

        const summary = await setUpKnex("transactions").where({ "session_id": session_id }).sum('amount', { as: "amount" }).first()

        return res.status(200).send({ summary })
    })
}