
import express from 'express';
import router from './routes';
import bodyParser, { urlencoded } from 'body-parser';

export default class App {
    application: express.Application;

    constructor() {
        this.application = express();
    }

    init(port: number): App {
        try {
            console.log(`server is running at port: ${port}`);
            this.application.listen(port);
            
        }catch(err) {
            throw new Error(err.message);
        }

        return this;
    }

    use(service: any): App {
        this.application.use(service);
        return this;
    }

    testing() {
        this.application.use(bodyParser.json())
        this.application.use(urlencoded({extended: true}))
        this.application.use(router);
        return this.application;
    }
}