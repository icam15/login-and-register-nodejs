import supertest  from "supertest";
import { web } from "../app/web";
import { createTestUser, removeTestUser } from "./util-test";
import { logger } from "../app/logging";

describe ('POST/api/login', () => {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it("should user login", async () => {
        const result = await supertest(web)
                    .post('/api/login')
                    .send({
                        email: "test@gmail.com",
                        password: "test"
                    })
        logger.info(result);
        expect(result.status).toBe(200);
    });
});