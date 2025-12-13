import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';
import User from '../models/userModel.js';
import './setup.js';

describe('Product Endpoints', () => {
  let adminToken;
  let userToken;

  beforeAll(async () => {
    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URI);
    }
    
    // Wait for connection to be fully ready
    if (mongoose.connection.readyState === 1) {
      console.log('MongoDB connection ready');
    } else {
      await mongoose.connection.asPromise();
      console.log('MongoDB connection established');
    }
    
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

    // Make user admin - WAIT for the update to complete
    const updatedAdmin = await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      { isAdmin: true },
      { new: true } // Return the updated document
    );
    
    // Verify the user is actually admin now
    console.log('Admin user after update:', {
      email: updatedAdmin.email,
      isAdmin: updatedAdmin.isAdmin,
      id: updatedAdmin._id
    });

    // Login as admin
    const adminLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'admin@test.com',
        password: 'Admin1234'
      });
    
    adminToken = adminLoginRes.body.token;
    
    console.log('Admin login response:', {
      status: adminLoginRes.statusCode,
      hasToken: !!adminToken,
      isAdmin: adminLoginRes.body.isAdmin,
      userId: adminLoginRes.body._id
    });
    
    expect(adminLoginRes.statusCode).toBe(200);
    expect(adminToken).toBeTruthy();
    expect(adminLoginRes.body.isAdmin).toBe(true); // Verify admin status

    // Create regular user
    await request(app)
      .post('/api/users/register')
      .send({
        name: 'Regular User',
        email: 'user@test.com',
        password: 'User1234'
      });

    // Login as user
    const userLoginRes = await request(app)
      .post('/api/users/login')
      .send({
        email: 'user@test.com',
        password: 'User1234'
      });
    
    userToken = userLoginRes.body.token;
    
    expect(userLoginRes.statusCode).toBe(200);
    expect(userToken).toBeTruthy();
  }, 30000);

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
        .set('Authorization', `Bearer ${adminToken}`)
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
        .set('Authorization', `Bearer ${userToken}`)
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
