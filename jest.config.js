const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Next.jsアプリのパスを指定
  dir: './',
})

// Jest用のカスタム設定
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    // 絶対パスでのインポートをマップ
    '^@/components/(.*)$': '<rootDir>/components/$1',
    '^@/app/(.*)$': '<rootDir>/app/$1',
    '^@/lib/(.*)$': '<rootDir>/lib/$1',
    '^@/utils/(.*)$': '<rootDir>/utils/$1',
    '^@/types/(.*)$': '<rootDir>/types/$1',
    '^@/hooks/(.*)$': '<rootDir>/hooks/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
  testMatch: [
    '**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)',
    '**/*.(test|spec).(js|jsx|ts|tsx)'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/playwright-tests/'
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    'components/**/*.{js,jsx,ts,tsx}',
    'lib/**/*.{js,jsx,ts,tsx}',
    'utils/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.config.js',
    '!**/coverage/**'
  ],
  coverageReporters: ['text', 'html', 'lcov'],
  coverageDirectory: 'coverage',
  verbose: true,
  silent: false,
}

// Next.js設定をJest設定と結合
module.exports = createJestConfig(customJestConfig)
