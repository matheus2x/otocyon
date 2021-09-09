module.exports = {
	roots: ["<rootDir>/src"],
	clearMocks: true,
	collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
	coverageDirectory: "coverage",
	testEnvironment: "node",
	testTimeout: 10000,
	transform: {
		".+\\.ts$": "ts-jest",
	},
	watchPathIgnorePatterns: ["globalConfig"],
};
