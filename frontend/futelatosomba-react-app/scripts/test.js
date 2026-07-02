'use strict';

// jsdom 16 pulls in whatwg-url/tr46 versions that still load Node's deprecated
// core `punycode` module. The warning is harmless on Node 22, but it makes test
// output noisy. Suppress only DEP0040 here rather than hiding all warnings.
const originalEmitWarning = process.emitWarning;
process.emitWarning = function emitWarningWithoutDeprecatedCorePunycode(warning, ...args) {
  const options = args[0];
  const code =
    (warning && typeof warning === 'object' && warning.code) ||
    (options && typeof options === 'object' && options.code) ||
    args[1];

  if (code === 'DEP0040') {
    return;
  }

  return originalEmitWarning.call(process, warning, ...args);
};

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';
process.env.PUBLIC_URL = '';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

// Ensure environment variables are read.
require('../config/env');

const fs = require('fs');
const path = require('path');
const jest = require('jest');
const execSync = require('child_process').execSync;
const paths = require('../config/paths');
let argv = process.argv.slice(2);

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

// Watch unless on CI or explicitly running all tests
if (
  !process.env.CI &&
  argv.indexOf('--watchAll') === -1 &&
  argv.indexOf('--watchAll=false') === -1
) {
  // https://github.com/facebook/create-react-app/issues/5210
  const hasSourceControl = isInGitRepository() || isInMercurialRepository();
  argv.push(hasSourceControl ? '--watch' : '--watchAll');
}

// This project keeps the CRA test runner in ./scripts instead of using
// react-scripts directly, so Jest needs an explicit app config. Without this,
// Jest uses its defaults, treats scripts/test.js itself as a test file, and
// does not apply the app's Babel/CSS/file transforms.
const config = {
  roots: [paths.appSrc],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  setupFilesAfterEnv: fs.existsSync(paths.testsSetup) ? [paths.testsSetup] : [],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}',
  ],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': path.join(__dirname, '../config/jest/babelTransform.js'),
    '^.+\\.css$': path.join(__dirname, '../config/jest/cssTransform.js'),
    '^(?!.*\\.(js|jsx|mjs|cjs|ts|tsx|css|json)$)': path.join(__dirname, '../config/jest/fileTransform.js'),
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\](?!(@testing-library[/\\\\]jest-dom|dom-accessibility-api|date-fns)[/\\\\]).+\\.(js|jsx|cjs|ts|tsx)$',
  ],
  moduleNameMapper: {
    '^react-router-dom$': '<rootDir>/node_modules/react-router-dom/dist/index.js',
    '^react-router$': '<rootDir>/node_modules/react-router/dist/development/index.js',
    '^react-router/dom$': '<rootDir>/node_modules/react-router/dist/development/dom-export.js',
    '^@vercel/speed-insights/react$': '<rootDir>/node_modules/@vercel/speed-insights/dist/react/index.js',
    '^axios$': '<rootDir>/node_modules/axios/dist/node/axios.cjs',
  },
  moduleFileExtensions: paths.moduleFileExtensions,
  resetMocks: false,
};

argv = ['--config', JSON.stringify(config), ...argv];

jest.run(argv);
