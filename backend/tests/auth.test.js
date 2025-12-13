// backend/tests/auth.test.js
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import './setup.js';

describe('Auth Endpoints', () => {
  beforeAll(async () => {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/esports-cart-test';
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('POST /api/users/register', () => {
    it('should create a new user and set cookie', async () => {
      const res = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Test1234'
        });

      expect(res.statusCode).toBe(201);
      // Verify cookie is present
      expect(res.headers['set-cookie']).toBeDefined();
      
      // FIX: Controller returns user data at root, not nested under 'user'
      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'Test User');
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });
  });

  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send({
          name: 'Login Test',
          email: 'login@example.com',
          password: 'Test1234'
        });
    });

    it('should login and set cookie', async () => {
      const res = await request(app)
        .post('/api/users/login')
        .send({
          email: 'login@example.com',
          password: 'Test1234'
        });

      expect(res.statusCode).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();
      // Verify response body
      expect(res.body).toHaveProperty('email', 'login@example.com');
    });
  });
});
