// Test database setup
process.env.NODE_ENV = 'test';
process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/esports-cart-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key-for-testing-only-minimum-32-characters';
process.env.GOOGLE_CLIENT_ID = 'test-google-client-id';
process.env.GOOGLE_CLIENT_SECRET = 'test-google-client-secret';
process.env.GOOGLE_CALLBACK_URL = 'http://localhost:5000/auth/google/callback';

// Mock Passport Google OAuth2 to prevent initialization errors in tests
jest.mock('passport-google-oauth20', () => ({
  Strategy: jest.fn(() => ({}))
}));
