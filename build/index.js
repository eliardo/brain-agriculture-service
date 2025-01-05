"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const data_source_1 = require("./database/data-source");
const routing_controllers_1 = require("routing-controllers");
const typedi_1 = __importDefault(require("typedi"));
const logger_1 = require("./config/logger");
require("dotenv/config");
const express_jsdoc_swagger_1 = __importDefault(require("express-jsdoc-swagger"));
const app_1 = __importDefault(require("./app"));
(0, routing_controllers_1.useContainer)(typedi_1.default);
(async () => {
    try {
        logger_1.logger.info(`Starting....`);
        await data_source_1.AppDataSource.initialize();
        await data_source_1.AppDataSource.runMigrations();
        logger_1.logger.info(`Database ready`);
        const options = {
            info: {
                version: '1.0.0',
                title: 'Brain Agriculture Service',
                description: 'Service to manage farms, farmers and harvest',
            },
            baseDir: __dirname,
            filesPattern: './controller/*.{js,ts}',
            swaggerUIPath: '/api-docs',
        };
        (0, express_jsdoc_swagger_1.default)(app_1.default)(options);
        app_1.default.listen(process.env.PORT, async () => {
            logger_1.logger.info(`brain-agriculture-service running on port ${process.env.PORT}`);
        });
    }
    catch (error) {
        logger_1.logger.error(`Error to try start service or connect at database: ${JSON.stringify(error)}`);
    }
})();
//# sourceMappingURL=index.js.map