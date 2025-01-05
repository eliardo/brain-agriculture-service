import 'reflect-metadata';
import { AppDataSource } from './database/data-source';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';
import { logger } from './config/logger';
import 'dotenv/config';
import expressJSDocSwagger from 'express-jsdoc-swagger';
import app from './app'

useContainer(Container);


(async () => {
    try {
        logger.info(`Starting....`);
        
        await AppDataSource.initialize();
        await AppDataSource.runMigrations();
        logger.info(`Database ready`);

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

        expressJSDocSwagger(app)(options);

        app.listen(process.env.PORT, async () => {
            logger.info(
                `brain-agriculture-service running on port ${process.env.PORT}`,
            );
        });
    } catch (error) {
        logger.error(
            `Error to try start service or connect at database: ${JSON.stringify(
                error,
            )}`,
        );
    }
})();
