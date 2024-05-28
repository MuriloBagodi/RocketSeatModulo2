import { afterAll, beforeAll, describe, expect, test, it, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../app";
import { title } from "process";
import { execSync } from "child_process";
import { randomUUID } from "crypto";

describe("Transactions Routes.", () => {
    beforeAll(async () => {
        execSync("bun knex migrate:latest")
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(()=>{
        execSync("bun knex migrate:rollback --all")
        execSync("bun knex migrate:latest")
    })

    it("should be able to create a new transaction", async () => {
        await request(app.server)
            .post("/transactions")
            .send({
                title: "New transaction",
                amount: 5000,
                type: "credit",
            })
            .expect(201);
    });

    it("Should be able to list all transactions", async () => {
        const createTransactionResponse = await request(app.server).post("/transactions").send({
            title: "New transaction",
            amount: 5000,
            type: "credit",
        });
        const cookies: any = createTransactionResponse.get("Set-Cookie");
        const listTransactionsResponse = await request(app.server).get("/transactions").set("Cookie", cookies).expect(200)
        console.log(listTransactionsResponse.body)
        expect(listTransactionsResponse.body.transactions).toEqual([
            expect.objectContaining({
                title: "New transaction",
                amount: 5000,
            })
        ]);
    });
});
