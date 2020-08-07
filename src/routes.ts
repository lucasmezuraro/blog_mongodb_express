import express, { Router, Request, Response } from 'express';
import { DatabaseManager } from './database';
import userController, { UserController } from './controllers/user.controller';
import postController from './controllers/post.controller';
import categoryController from './controllers/category.controller';

import {KafkaClient, Producer, Consumer} from 'kafka-node';
const bp = require('body-parser');
const config = require('../src/config-kafka');

const db = new DatabaseManager().getConnection();

const router: Router = express.Router();

router.get("/users/", userController.index);
router.get("/users/:id", userController.findOne);
router.post("/users/", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete);

router.get('/posts', postController.get);
router.post('/posts', postController.create);
router.get("/posts/about/:category", postController.getByCategory);
router.get("/posts/categories/:category/author/:author", postController.getByCategoryAndAuthor);

router.post("/categories", categoryController.index);

router.get("/posts/count", async (req: Request, res: Response) => {
});

router.post("/producer", async (req: Request, res: Response) => {

    const user = {
      username: 'lucas',
      email: 'lucas@gmail.com'
    };

    try {
        console.log(config);
        const client = new KafkaClient(config.kafka_server);
        const producer = new Producer(client);
        const kafka_topic = 'mytopic';
        let payloads = [
          {
            topic: kafka_topic,
            messages: JSON.stringify(user)
          }
        ];
      
        producer.on('ready', async function() {
          let push_status = producer.send(payloads, (err: any, data: any) => {
            console.log('kafka is connected');
            let type = 0;
            if (err) {
              console.log(err);
              console.log('[kafka-producer -> '+kafka_topic+']: broker update failed');
              type = 1;
            } else {
              type = 2;
              console.log('[kafka-producer -> '+kafka_topic+']: broker update success');
            }

            return res.json({message: data});
          });
        });
      
        producer.on('error', function(err: any) {
          console.log(err);
          console.log('[kafka-producer -> '+kafka_topic+']: connection errored');
          throw err;
        });
      }
      catch(e) {
        console.log(e);
      }
});

router.get("/consumer", async (req: Request, res: Response) => {
    try {
        const client = new KafkaClient(config.kafka_server);
        let consumer = new Consumer(
          client,
          [{ topic: config.kafka_topic, partition: 0 }],
          {
            autoCommit: true,
            fetchMaxWaitMs: 1000,
            fetchMaxBytes: 1024 * 1024,
            encoding: 'utf8',
            fromOffset: false
          }
        );
        consumer.on('message', async function(message:any) {
          console.log('here');
          const mess = await JSON.parse(message.value);
          console.log(
            'kafka-> ',
            mess
          );

          return res.json({mess});
        })

        consumer.on('error', function(err: any) {
          console.log('error', err);
        });
      }
      catch(e) {
        console.log(e);
      }
});

export default router;