import supertest from "supertest";
import { web } from "../app/web.js";
import { removeTestUser } from "./util-test.js";

describe('POST/api/register', () => {

    afterEach(async () => {
        await removeTestUser();
    });

    it("Shoul register user", async () =>{ 
        const result = await supertest(web)
                .post('/api/register')
                .send({
                    name: "test",
                    password: "test",
                    email: "test@gmail.com"
                })
        expect(result.status).toBe(200);
    })
});

