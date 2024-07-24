module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.ts$': 'ts-jest',
        '^.+\\.js$': 'babel-jest',
    },
    testMatch: ['<rootDir>/test/**/*.test.(ts|js)'],
    moduleNameMapper: {
        '^#shared/(.*)$': '<rootDir>/shared/$1',
    },
    transformIgnorePatterns: [
        '/node_modules/(?!(chai|chai-http)/)',
    ],
};
