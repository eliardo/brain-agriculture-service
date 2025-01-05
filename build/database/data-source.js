"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const typedi_1 = require("typedi");
const farm_entity_1 = require("../entity/farm-entity");
const farmer_entity_1 = require("../entity/farmer-entity");
const harvest_entity_1 = require("../entity/harvest-entity");
const _1735519197062_InitialCreateTables_1 = require("./migrations/1735519197062-InitialCreateTables");
require("dotenv/config");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: false,
    entities: [farmer_entity_1.Farmer, farm_entity_1.Farm, harvest_entity_1.Harvest],
    migrations: [_1735519197062_InitialCreateTables_1.InitialCreateTables1735519197062],
});
typedi_1.Container.set("dataSource", exports.AppDataSource);
//# sourceMappingURL=data-source.js.map