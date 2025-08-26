/** @type {import('jest').Config} */
export default {
  // ESM + TS
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
  // Trata .ts como ESM
  extensionsToTreatAsEsm: ['.ts'],

  // Ajuste para imports relativos "sem .js" gerados pelo TS
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  testMatch: [
    '<rootDir>/test/unit/**/*.test.ts',
    '<rootDir>/test/integration/**/*.test.ts',
  ],
};
