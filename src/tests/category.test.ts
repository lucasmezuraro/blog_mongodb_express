import supertest, { Request, Test, SuperTest } from "supertest";
import App from "../application";
import { DatabaseManager } from "../database";
import { Connection } from "mongoose";

describe("testing root route", () => {

    let app: Express.Application = new App().testing();
    let agent: SuperTest<Test> =  supertest(app);
    let userTest = {
        username: 'lucas',
        email: 'lucas@gmail.com',
        password: '123'
    }

    afterEach(async () => {
        const dbTest: Connection = await new DatabaseManager().getConnection();
        dbTest.dropCollection('users');
        dbTest.dropCollection('posts');
        dbTest.dropCollection('categories');
    });

  it('post /categories should create a new category',async  () => {
        const request: Request = agent.post("/categories").send({description: "test"});
        expect((await request).status).toBe(200);
    });

});