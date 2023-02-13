import type { Config } from '@jest/types';

const baseDir = '<rootDir>/src/app/server_app/utils';
const baseTestDir = '<rootDir>/src/test/server_app/utils';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: [`${baseTestDir}/**/*.ts`],
  collectCoverage: true,
  collectCoverageFrom: [`${baseDir}/**/*.ts`]
}

export default config;