import * as dotenv from 'dotenv';

// Load environment variables for testing
dotenv.config({ path: '.env.test' });

// Mock console.log to reduce noise during tests
const originalConsoleLog = console.log;
console.log = jest.fn();

// Restore console.log after all tests
afterAll(() => {
  console.log = originalConsoleLog;
});
