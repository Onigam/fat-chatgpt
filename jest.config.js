module.exports = {
    testPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
    moduleDirectories: ["node_modules", "<rootDir>/src"],
    moduleNameMapper: {
      "^@/app(.*)$": "<rootDir>/src/app$1"
    },
    "preset": "ts-jest",
    "testEnvironment": "node"
  };