import supertest, { Request, Test, SuperTest } from "supertest";
import App from "../src/application";
import { DatabaseManager } from "../src/database";
import { Connection } from "mongoose";

describe("testing root route", () => {

    let app: Express.Application = new App().testing();
    let agent: SuperTest<Test> =  supertest(app);
    let userTest = {
        username: 'lucas',
        email: 'lucas@gmail.com',
        password: '123'
    }

    it('get /posts should be defined',async  () => {
        const request: Request = agent.get("/posts");
        expect((await request).body).not.toBeNull();
    });

});