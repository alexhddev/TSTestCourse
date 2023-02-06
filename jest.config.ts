import type { Config } from '@jest/types';

const baseDir = '<rootDir>/src/app/doubles';
const baseTestDir = '<rootDir>/src/test/doubles';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testMatch: [`${baseTestDir}/**/*.ts`],
  collectCoverage: true,
  collectCoverageFrom: [`${baseDir}/**/*.ts`]
}

export default config;