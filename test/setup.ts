import 'reflect-metadata';
import dotenv from 'dotenv';
import { beforeAll, describe, expect, it, jest } from '@jest/globals';
import { useContainer } from 'routing-controllers';
import Container from 'typedi';

dotenv.config({ path: '.env.test' });

global.console.log = jest.fn();
global.console.warn = jest.fn();
global.console.info = jest.fn();
global.console.error = jest.fn();

jest.mock('../src/config/logger', () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    },
}));


beforeAll(async () => {
    useContainer(Container);
});

describe('Environment Variables', () => {
    it('should load variables from .env.test', () => {
        expect(process.env.NODE_ENV).toBe('test');
    });
});
