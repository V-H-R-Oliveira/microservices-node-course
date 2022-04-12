/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    bail: 1,
    setupFilesAfterEnv: [
        "./src/test/setup.ts"
    ],
    setupFiles: [
        "./src/test/env.ts"
    ],
    injectGlobals: false,
    testTimeout: 60000, // 1 minute
    clearMocks: true
}