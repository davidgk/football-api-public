module.exports = {
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  forceExit: true,
  maxWorkers: 1,
  setupFilesAfterEnv: ['./setupJest.js'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.ts',
    '!<rootDir>/src/**/migrations/*.ts',
    '!<rootDir>/src/**/test/*.ts',
  ],
  detectOpenHandles: true,
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/app/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@database/(.*)': '<rootDir>/src/database/$1',
    '@commons/(.*)': '<rootDir>/src/commons/$1',
    '@football-api/(.*)': '<rootDir>/src/football-api/$1',
    '@players/(.*)': '<rootDir>/src/players/$1',
    '@teams/(.*)': '<rootDir>/src/teams/$1',
    '@competitions/(.*)': '<rootDir>/src/competitions/$1',
  },
};
