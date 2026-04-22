// eslint.config.js
// ESLint v9 configuration with Airbnb-style rules

import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';

export default [
  {
    ignores: [
      'out/**',
      '.next/**', 
      'coverage/**',
      'node_modules/**',
      '*.mjs',
      'jest.config.js',
      'jest.setup.js',
      'next-env.d.ts',
      '*.tmp',
      '.temp/**',
      '**/__tests__/**',
      '**/*.test.*',
      '**/*.spec.*',
      // Additional ignores for surgical recovery
      '**/*.config.js',
      '**/*.config.ts',
      'build/**',
      'dist/**',
      '.vscode/**',
      '.windsurf/**',
      'docs/**',
      '*.backup',
      '*.old',
      '*.bak',
      '.backup-*/**',
      '.structural-backup-*/**'
    ]
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: './tsconfig.json',
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        console: 'readonly',
        alert: 'readonly',
        btoa: 'readonly',
        atob: 'readonly',
        // React globals
        React: 'readonly',
        // TypeScript globals
        NodeJS: 'readonly',
        process: 'readonly',
        performance: 'readonly',
        // IndexedDB globals
        indexedDB: 'readonly',
        IDBDatabase: 'readonly',
        IDBTransaction: 'readonly',
        IDBRequest: 'readonly',
        IDBCursor: 'readonly',
        IDBObjectStore: 'readonly',
        IDBIndex: 'readonly',
        IDBKeyRange: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
    rules: {
      // TypeScript rules (relaxed for surgical recovery)
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_'
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      
      // Import rules (relaxed for surgical recovery)
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          alphabetize: { order: 'asc' },
          'newlines-between': 'never',
        },
      ],
      'import/no-unresolved': 'warn',
      'import/no-cycle': 'warn',
      'import/no-duplicates': 'warn',
      
      // React rules (relaxed for surgical recovery)
      'react-hooks/rules-of-hooks': 'error', // Keep this critical rule
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-key': 'warn',
      
      // JSX A11y rules (relaxed for surgical recovery)
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      
      // General rules (relaxed for surgical recovery)
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-console': 'off',
      'no-debugger': 'warn',
      'no-unused-vars': 'off', // Handled by @typescript-eslint/no-unused-vars
      'eqeqeq': ['warn', 'always'],
      'curly': ['warn', 'all'],
      'brace-style': ['warn', '1tbs'],
      'comma-dangle': ['warn', 'always-multiline'],
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single'],
      'indent': 'off', // Let Prettier handle formatting
      'no-trailing-spaces': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2 }],
    },
  },
  {
    files: ['**/*.js', '**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        require: 'readonly',
        module: 'readonly',
        exports: 'readonly',
        Buffer: 'readonly',
        global: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console in Node.js files
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
    languageOptions: {
      globals: {
        jest: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },
  {
    files: ['database/**/*.cjs', 'scripts/**/*.cjs', 'scripts/**/*.js'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
        URL: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'off',
    },
  },
  {
    files: ['**/sw.js', '**/sw-*.js', '**/service-worker.js', '**/assets/sw*.js'],
    languageOptions: {
      globals: {
        // Service Worker globals (built-ins are automatically available)
        importScripts: 'readonly',
        clients: 'readonly',
        skipWaiting: 'readonly',
        registration: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-redeclare': 'off', // Allow redeclaring built-in globals in service workers
    },
  },
  {
    files: ['**/out/**', '**/.next/**'],
    languageOptions: {
      globals: {
        // Build output globals
        self: 'readonly',
        caches: 'readonly',
        fetch: 'readonly',
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        WebAssembly: 'readonly',
        TURBOPACK_NEXT_CHUNK_URLS: 'readonly',
        TURBOPACK_WORKER_LOCATION: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
];
