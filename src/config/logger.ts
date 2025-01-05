import winston from 'winston';
import 'dotenv/config'


const { combine, timestamp, printf } = winston.format;

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        timestamp({
            format: 'YYYY-MM-DD hh:mm:ss.SSS A',
        }),
        printf(info => `[${info.timestamp}] ${info.level}: ${info.message}`),
    ),
    transports: [new winston.transports.Console()],
});
