/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  extensionsToTreatAsEsm: ['.ts'],

  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testMatch: [
    '<rootDir>/test/unit/**/*.test.ts',
    '<rootDir>/test/integration/**/*.test.ts',
  ],
};
