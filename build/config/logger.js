"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
require("dotenv/config");
const { combine, timestamp, printf } = winston_1.default.format;
exports.logger = winston_1.default.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }), printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`)),
    transports: [new winston_1.default.transports.Console()],
});
//# sourceMappingURL=logger.js.map