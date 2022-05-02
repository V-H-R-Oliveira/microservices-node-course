/* eslint-disable no-undef */
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { accessSync } = require("fs")

let hasLocalEnv = false

try {
    accessSync("./src/test/local-test-env.ts")
    hasLocalEnv = true
    console.info("Running in local environment")
} catch (err) {
    console.warn("Running in external environment")
}

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    bail: 1,
    setupFilesAfterEnv: [
        "./src/test/setup.ts"
    ],
    setupFiles: hasLocalEnv ? [
        "./src/test/local-test-env.ts"
    ] : [
        "./src/test/env-without-stripe.ts"
    ],
    injectGlobals: false,
    testTimeout: 60000, // 1 minute
    clearMocks: true
}