import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const NODE_TESTS = ['<rootDir>/src/server/**/*.test.ts', '<rootDir>/src/app/**/route.test.ts']

const sharedConfig: Config = {
	clearMocks: true,
	moduleNameMapper: {
		'^tests/(.*)$': '<rootDir>/__tests__/$1',
		'^.+\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
		'^next/navigation$': '<rootDir>/__mocks__/navigatorMock.js'
	},
	testPathIgnorePatterns: [
		'<rootDir>/node_modules/',
		'<rootDir>/.next/',
		'<rootDir>/__tests__/helpers/'
	]
}

const clientConfig: Config = {
	...sharedConfig,
	displayName: 'client',
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
	testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}'],
	testPathIgnorePatterns: [
		...(sharedConfig.testPathIgnorePatterns ?? []),
		'<rootDir>/src/server/',
		'<rootDir>/src/app/.*/route\.test\.ts$'
	]
}

const serverConfig: Config = {
	...sharedConfig,
	displayName: 'server',
	testEnvironment: 'node',
	testMatch: NODE_TESTS
}

const config = async (): Promise<Config> => ({
	coverageProvider: 'v8',
	verbose: true,
	projects: [await createJestConfig(clientConfig)(), await createJestConfig(serverConfig)()]
})

export default config
