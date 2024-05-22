import { afterAll, beforeAll, describe, expect, test, it } from "vitest";
import request from "supertest";
import { app } from "../app";
import { title } from "process";

describe("Transactions Routes.", () => {
    beforeAll(async () => {
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

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
        
        expect(listTransactionsResponse.body).toEqual([
            expect.objectContaining({
                title: "New Transaction",
                amount: 5000,
                type: "credit",
            })
        ]);
    });
});
