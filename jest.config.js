module.exports = {
    // The root directory that Jest should scan for tests and modules within
    rootDir: '.',
  
    // The test environment that will be used for testing
    testEnvironment: 'jsdom',
  
    // The glob patterns Jest uses to detect test files
    testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  
    // An array of file extensions your modules use
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
  
    // A list of paths to directories that Jest should use to search for files in
    roots: ['<rootDir>/src'],
  
    // Setup files after env is set up
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  
    // Transform files
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },
  
    // Ignore transforming node_modules except for specific modules (like axios)
    transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  
    // Module name mapper for handling static assets
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
      '\\.(gif|ttf|eot|svg)$': '<rootDir>/__mocks__/fileMock.js',
    },
  
    // Coverage configuration
    collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/index.js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/src/reportWebVitals.js'],
  };