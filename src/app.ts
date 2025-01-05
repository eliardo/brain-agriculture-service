import 'reflect-metadata';
import { useExpressServer } from 'routing-controllers';
import { json } from 'body-parser';
import 'dotenv/config';
import express from 'express';

const app = express();
app.use(express.json());

app.use(json());
useExpressServer(app, {
    controllers: [__dirname + '/controller/*'],
    classTransformer: true,
});

export default app;
