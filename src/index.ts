import App from "../src/application";
import bodyParser, {json, urlencoded} from 'body-parser';
import router from "./routes";
import { Mongoose, connect } from "mongoose";

const server = new App();        
server.use(json())
    .use(urlencoded({extended: true}))
    .use(router)
.init(3000);



