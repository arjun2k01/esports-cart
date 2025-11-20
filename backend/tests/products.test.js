import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';

describe('Product Endpoints', () => {
  let adminCookie;
  let userCookie;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Clean up any existing test users
    await User.deleteMany({ email: { $in: ['admin@test.com', 'user@test.com'] } });
    
    // Create admin user
    await request(app)
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

    // Login as admin and extract cookie
    const adminLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin1234'
      });
    
    // Extract the cookie string (first cookie in the array)
    const cookies = adminLoginRes.headers['set-cookie'];
    adminCookie = cookies[0].split(';')[0]; // Extract just "token=value" part
    
    expect(adminLoginRes.statusCode).toBe(200);
    expect(adminCookie).toBeTruthy();

    // Create regular user
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User1234'
      });

    // Login as user and extract cookie
    const userLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'user@test.com',
        password: 'User1234'
      });
    
    // Extract the cookie string
    const userCookies = userLoginRes.headers['set-cookie'];
    userCookie = userCookies[0].split(';')[0]; // Extract just "token=value" part
    
    expect(userLoginRes.statusCode).toBe(200);
    expect(userCookie).toBeTruthy();
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
        .set('Cookie', adminCookie)
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
        .set('Cookie', userCookie)
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
