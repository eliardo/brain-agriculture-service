const config = require('./jest.config');
config.testMatch = ["**/integrated/*.(test).(ts)"];
config.setupFilesAfterEnv = ['./test/setup.ts'];
module.exports = config;
