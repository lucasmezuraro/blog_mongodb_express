import { connect, Connection } from "mongoose";
import dotenv from 'dotenv';
const envs = dotenv.config();

export class DatabaseManager {

    constructor() {
    }

    async getConnection(): Promise<Connection> {

        const typeEnv = process.env.NODE_ENV;
        const environmentTestDatabaseConfig = {
            uri: `mongodb://lucas:123456a@ds359847.mlab.com:59847/testing_test` 
        }
        const environmentDevDatabaseConfig = {
            uri: `mongodb://lucas:123456a@ds145952.mlab.com:45952/api` 
        }
        const environmentDatabase = typeEnv === "test" ? 'testing_test' :  'api'; 

       try {
            const db = await connect(typeEnv === 'test' ? environmentTestDatabaseConfig.uri : environmentDevDatabaseConfig.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useFindAndModify: false,
                autoCreate: true,
                useCreateIndex: true,
            });

            return db.connection;
        }catch(err) {
            throw new Error(err.message);
        }
    }
}