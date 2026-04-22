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
        '^@/(.*)$': '<rootDir>/src/$1',
        '^@/lib/theme/colors$': '<rootDir>/src/lib/theme/colors',
        '^@/lib/(.*)$': '<rootDir>/src/lib/$1',
        '^@/components/(.*)$': '<rootDir>/src/components/$1',
        '^@/app/(.*)$': '<rootDir>/app/$1',
        '^@/src/(.*)$': '<rootDir>/src/$1',
        '^@/types/(.*)$': '<rootDir>/src/types/$1',
        '^@/hooks/(.*)$': '<rootDir>/src/hooks/$1',
        '^@/contexts/(.*)$': '<rootDir>/src/contexts/$1',
        '^@/services/(.*)$': '<rootDir>/src/services/$1',
        '^@/utils/(.*)$': '<rootDir>/src/utils/$1',
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
