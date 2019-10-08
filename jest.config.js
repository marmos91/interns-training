module.exports = {
  bail: true,
  collectCoverage: true,
  roots: [
    './test'
  ],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
}
