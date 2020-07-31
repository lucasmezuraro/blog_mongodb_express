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

    it('get / should be defined',async  () => {
        const request: Request = agent.get("/users");
        expect((await request).body).not.toBeNull();
    });

    afterEach(async () => {
        const dbTest: Connection = await new DatabaseManager().getConnection();
        dbTest.dropCollection('users');
    });

    it('post / should create a user', async () => {
        const request: any = await agent.post("/users")
        .send({user: userTest});
        expect(request.body.users?.username).toContain(userTest.username)
    });

    it('put / should update a user', async () => {

        let userUpdate = {
            username: 'lucas2'
        }

        const requestCreate: any = await agent.post("/users")
        .send({user: userTest});
        expect(requestCreate.body.users?.username).toContain(userTest.username)

        const requestUpdate: any = await agent.put(`/users/${requestCreate.body.users?._id}`)
        .send({user: userUpdate});
        expect(requestUpdate.body.user?.username).toContain(userUpdate.username)
    });

    it('delete / should delete a user', async () => {

        const requestCreate: any = await agent.post("/users")
        .send({user: userTest});
        expect(requestCreate.body.users?.username).toContain(userTest.username);

        const requestUpdate: any = await agent.del(`/users/${requestCreate.body.users?._id}`)
        expect(requestUpdate.body.removed).toBe(1);
    });
});