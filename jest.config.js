module.exports = {
  "roots": [
    "<rootDir>/src",
    "<rootDir>/src/test"
  ],
  "transform": {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  "collectCoverage": true,
  "collectCoverageFrom": ["src/**/*.{ts,tsx,js,jsx}"],
  "coverageReporters": ["html"]
};
