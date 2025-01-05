import { DataSource } from "typeorm";
import { Container } from "typedi";
import { Farm } from "../entity/farm-entity";
import { Farmer } from "../entity/farmer-entity";
import { Harvest } from "../entity/harvest-entity";
import { InitialCreateTables1735519197062 } from "./migrations/1735519197062-InitialCreateTables";
import 'dotenv/config';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [Farmer, Farm, Harvest],
    migrations: [InitialCreateTables1735519197062],
});

Container.set("dataSource", AppDataSource);

