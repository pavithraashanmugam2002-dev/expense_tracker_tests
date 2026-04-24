
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/system-integration/**/*.spec.ts'],
  transform: {
    '^.+\\.ts$': ['babel-jest', { presets: ['@babel/preset-env'] }],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
