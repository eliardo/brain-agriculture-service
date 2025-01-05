"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const routing_controllers_1 = require("routing-controllers");
const body_parser_1 = require("body-parser");
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, body_parser_1.json)());
(0, routing_controllers_1.useExpressServer)(app, {
    controllers: [__dirname + '/controller/*'],
    classTransformer: true,
});
exports.default = app;
//# sourceMappingURL=app.js.map