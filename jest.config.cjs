module.exports = {
  roots: ["<rootDir>/dist"],
  setupFilesAfterEnv: ["jest-extended/all"],
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.js$",
  moduleFileExtensions: ["js", "jsx"],
  verbose: true,
  testEnvironment: "node",
};
