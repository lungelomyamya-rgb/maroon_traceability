export default {
  projects: [
    {
      displayName: 'root',
      testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
      testEnvironment: 'jsdom',
      transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
      },
      moduleFileExtensions: ['ts', 'tsx', 'js'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^@/lib/theme/colors$': '<rootDir>/lib/theme/colors',
        '^@/lib/(.*)$': '<rootDir>/lib/$1',
        '^@/components/(.*)$': '<rootDir>/components/$1',
        '^@/app/(.*)$': '<rootDir>/app/$1',
        '^@/src/(.*)$': '<rootDir>/src/$1',
        '^@/types/(.*)$': '<rootDir>/types/$1',
        '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
        '^@/contexts/(.*)$': '<rootDir>/contexts/$1',
        '^@/services/(.*)$': '<rootDir>/services/$1',
        '^@/utils/(.*)$': '<rootDir>/utils/$1',
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
      },
      collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
      ],
      coverageDirectory: 'coverage',
    },
  ],
  testTimeout: 10000,
  passWithNoTests: true,
}
