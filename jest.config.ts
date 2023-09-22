import type { Config } from '@jest/types'

const baseDir = '<rootDir>/src/app/server_app';
const baseTestDir = '<rootDir>/src/test/server_app3/ex';

const config: Config.InitialOptions = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    collectCoverage: false,
    // collectCoverageFrom: [
    //     `${baseDir}/**/*.ts`
    // ],
    testMatch:[
        `${baseTestDir}/**/*test.ts`,
    //    `${baseTestDir}/server_app3/ex/**/*test.ts`,
    ]
}

export default config;