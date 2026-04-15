// jest.setup.js
/* global jest, global */
require('@testing-library/jest-dom');

// Mock theme colors
jest.mock('@/lib/theme/colors', () => ({
  commonColors: {
    white: 'text-white',
    black: 'text-black',
    gray50: 'bg-gray-50',
    gray100: 'bg-gray-100',
    gray200: 'bg-gray-200',
    gray400: 'text-gray-400',
    gray500: 'text-gray-500',
    gray600: 'text-gray-600',
    gray700: 'text-gray-700',
    gray800: 'text-gray-800',
    gray900: 'text-gray-900',
    borderGray200: 'border-gray-200',
  },
  dashboardColors: {
    green: {
      bg: 'bg-green',
      light: 'bg-green-light',
      text: 'text-green-foreground',
      border: 'border-green/20',
      hover: 'hover:bg-green-hover',
    },
    blue: {
      bg: 'bg-blue',
      light: 'bg-blue-light',
      text: 'text-blue-foreground',
      border: 'border-blue/20',
      hover: 'hover:bg-blue-hover',
    },
  },
}));

// Mock global objects
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

const util = require('util');
global.TextEncoder = util.TextEncoder;
global.TextDecoder = util.TextDecoder;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
}));