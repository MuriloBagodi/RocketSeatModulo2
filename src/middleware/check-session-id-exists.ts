import { FastifyReply, FastifyRequest } from "fastify"

export async function checkSessionIdExist(req: FastifyRequest, res: FastifyReply) {
    const sessionID = req.cookies.session_id
        if (!sessionID) {
            return res.status(401).send({ error: "Unauthorized" })
        }
}