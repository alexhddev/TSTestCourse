import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src/app/server_app';
const baseTestDir = '<rootDir>/src/test';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: true,
    collectCoverageFrom: [
        `${baseDir}/**/*.ts`
    ],
    testMatch:[
        `${baseTestDir}/server_app/**/*test.ts`,
        `${baseTestDir}/server_app2/**/*test.ts`,
        `${baseTestDir}/Utils.test.ts`
    ]
}

export default config;