import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';

describe('Product Endpoints', () => {
  let adminToken;
  let userToken;

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

    // Login as admin to get token
    const loginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin1234'
      });
    
    adminToken = loginRes.body.token;

    // Create regular user
    const userRes = await request(app)
      .post('/api/users/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User1234'
      });
    
    userToken = userRes.body.token;
  });

  afterAll(async () => {
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
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
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
      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Product',
          price: 999,
          image: 'https://example.com/image.jpg',
          category: 'Skins'
        });

      expect(res.statusCode).toBe(403);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Test Product',
          price: 999
        });

      expect(res.statusCode).toBe(401);
    });
  });
});
