const nextJest = require('next/jest')

const config = {
  projects: [
    {
      displayName: 'root',
      testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js'],
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
      ],
      coverageDirectory: 'coverage',
    },
  ],
  testTimeout: 10000,
}

module.exports = config
