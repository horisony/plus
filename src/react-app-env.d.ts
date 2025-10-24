/// <reference types="react-scripts" />
/// <reference types="jest" />

declare module 'react/jsx-runtime' {
  export default any;
}

declare global {
  const describe: jest.Describe;
  const it: jest.It;
  const expect: jest.Expect;
  const beforeEach: jest.Lifecycle;
  const afterEach: jest.Lifecycle;
  const beforeAll: jest.Lifecycle;
  const afterAll: jest.Lifecycle;
}