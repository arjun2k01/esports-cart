import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';

describe('Product Endpoints', () => {
  let adminCookies;
  let userCookies;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clean up any existing test users
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
    
    // Create admin user
    const adminRegRes = await request(app)
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

    // Login as admin and get cookies
    const adminLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin1234'
      });
    
    // Extract cookies from response
    adminCookies = adminLoginRes.headers['set-cookie'];
    expect(adminLoginRes.statusCode).toBe(200);
    expect(adminCookies).toBeDefined();

    // Create regular user
    const userRegRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User1234'
      });

    // Login as user and get cookies
    const userLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'user@test.com',
        password: 'User1234'
      });
    
    // Extract cookies from response
    userCookies = userLoginRes.headers['set-cookie'];
    expect(userLoginRes.statusCode).toBe(200);
    expect(userCookies).toBeDefined();
  });

  afterAll(async () => {
    // Clean up and close connection
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
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
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', adminCookies)
        .send({
          name: 'Test Product',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10,
          description: 'Test product description'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Product');
    });

    it('should fail without admin rights', async () => {
      const res = await request(app)
        .post('/api/products')
        .set('Cookie', userCookies)
        .send({
          name: 'Test Product 2',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10,
          description: 'Test product description'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product 3',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins',
          brand: 'TestBrand',
          countInStock: 10,
          description: 'Test product description'
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
