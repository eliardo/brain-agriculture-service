"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5433,
    username: "postgres",
    password: "12345678",
    database: "agriculture",
    synchronize: true,
    logging: false,
    entities: [],
    migrations: [],
    subscribers: [],
});
//# sourceMappingURL=data-source.js.map