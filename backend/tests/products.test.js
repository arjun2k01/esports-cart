import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';

describe('Product Endpoints', () => {
  let adminAgent;
  let userAgent;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Create admin user
    const adminRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Admin User',
        email: 'admin@test.com',
        password: 'Admin1234'
      });

    // Make user admin
    await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      { isAdmin: true }
    );

    // Create admin agent and login
    adminAgent = request.agent(app);
    await adminAgent
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin1234'
      });

    // Create regular user
    const userRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User1234'
      });

    // Create user agent and login
    userAgent = request.agent(app);
    await userAgent
      .post('/api/users/login')
      .send({
        email: 'user@test.com',
        password: 'User1234'
      });
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app).get('/api/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/products', () => {
    it('should create product as admin', async () => {
      const res = await adminAgent
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Product');
    });

    it('should fail without admin rights', async () => {
      const res = await userAgent
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
