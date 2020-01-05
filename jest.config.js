module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/src/test"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "collectCoverageFrom": ["src/**/*.{ts,tsx,js,jsx}"],
  "coverageReporters": ["lcov", "text"]
};
