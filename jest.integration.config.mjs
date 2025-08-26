import base from './jest.config.mjs';

/** @type {import('jest').Config} */
export default {
  ...base,
  testMatch: ['<rootDir>/test/integration/**/*.test.ts'],
};
