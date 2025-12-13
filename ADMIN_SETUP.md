# 🔐 ADMIN SETUP GUIDE FOR ESPORTS-CART

## Overview
This guide explains how to create the first admin user for your esports-cart application.

---

## ✅ Prerequisites

1. Backend server running (Node.js)
2. MongoDB Atlas database connected
3. Environment variables configured
4. Access to your backend server (local or Render)

---

## 🚀 Option 1: Create Admin Locally (Development)

### Step 1: Set Environment Variables in .env

In your `backend/.env` file, add:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/esports-cart
JWT_SECRET=your-secret-key-here
ADMIN_EMAIL=admin@esportscart.com
ADMIN_PASSWORD=AdminPass123!
ADMIN_NAME=System Admin
NODE_ENV=development
```

### Step 2: Run Admin Setup Script

```bash
node backend/admin-setup.js
```

### Expected Output:

```
MongoDB connected for admin setup
✅ Admin created successfully!
   Email: admin@esportscart.com
   Password: AdminPass123!

⚠️  Change this password immediately after first login!
```

---

## 🚀 Option 2: Create Admin on Production (Render)

### Step 1: Add Environment Variables to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select your esports-cart backend service
3. Go to **Environment** tab
4. Add these variables:
   - `ADMIN_EMAIL` = `admin@esportscart.com`
   - `ADMIN_PASSWORD` = `AdminPass123!` (change this!)
   - `ADMIN_NAME` = `System Admin`

### Step 2: Open Shell and Run Setup

1. In Render dashboard, click your service
2. Click **Shell** tab
3. Run this command:

```bash
node backend/admin-setup.js
```

### Step 3: Verify Output

You should see:
```
✅ Admin created successfully!
   Email: admin@esportscart.com
   Password: AdminPass123!
```

---

## 🔑 Login with Admin Credentials

Go to: **https://esports-cart.vercel.app/login**

Enter:
- **Email:** `admin@esportscart.com`
- **Password:** `AdminPass123!` (or your custom password)

Click **Login**

---

## ⚙️ Admin Features (What You Can Do)

Once logged in as admin, you'll have access to:

- ✅ **Product Management** - Create, edit, delete products
- ✅ **Order Management** - View and manage customer orders
- ✅ **User Management** - View all users and their profiles
- ✅ **Analytics** - See sales, revenue, and user statistics
- ✅ **Inventory** - Manage product stock levels

---

## 🔐 Security Best Practices

### 1. Change Default Password Immediately

After first login, go to **Profile** → **Settings** → **Change Password**

Use a strong password:
- ✅ At least 12 characters
- ✅ Mix of uppercase & lowercase
- ✅ Include numbers
- ✅ Include special characters (!@#$%^&*)

### 2. Never Share Admin Credentials

- Don't put credentials in Slack, email, or code
- Store in secure password manager (1Password, Bitwarden)
- Only share via encrypted channels

### 3. Rotate Credentials Regularly

- Change password every 90 days
- Review admin access logs monthly
- Revoke access for inactive admins

---

## 🆘 Troubleshooting

### Issue: "Admin already exists"

**Cause:** Admin user with that email already created

**Solution:**
```bash
# Delete existing admin from MongoDB and recreate
mongosh "mongodb+srv://..." 
db.users.deleteOne({ email: "admin@esportscart.com" })
# Then run setup again
```

### Issue: "MongoDB connection failed"

**Cause:** Wrong MONGO_URI or network access

**Solution:**
1. Verify MONGO_URI in .env is correct
2. Check MongoDB Atlas IP whitelist includes your server IP
3. Test connection: `mongosh "your_mongo_uri"`

### Issue: "Module not found: zod"

**Cause:** Dependencies not installed

**Solution:**
```bash
cd backend
npm install
node admin-setup.js
```

---

## 📝 Admin User Schema

When created, admin user has:

```javascript
{
  _id: ObjectId,
  name: "System Admin",
  email: "admin@esportscart.com",
  password: "<bcrypt_hashed>",
  isAdmin: true,  // ← This is the key!
  phone: "+91-9999999999",
  address: "Admin Address",
  city: "Admin City",
  state: "Admin State",
  postalCode: "000000",
  country: "India",
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## 🚀 Next Steps

1. ✅ Create admin user (you are here)
2. Login to admin dashboard
3. Add some test products
4. Create test orders
5. Test admin features
6. Set up admin notifications
7. Enable two-factor authentication (coming soon)

---

## ❓ FAQ

**Q: Can I have multiple admins?**
A: Yes! Create more admins by repeating the setup process with different emails.

**Q: How do I remove admin access?**
A: Go to MongoDB Atlas, find user, set `isAdmin: false`.

**Q: What if I forget the admin password?**
A: Reset via MongoDB or create a new admin user.

**Q: Is the password stored securely?**
A: Yes! It's hashed with bcrypt (salt rounds: 10). The original password is never stored.

---

## 📞 Support

For issues, create a GitHub issue: https://github.com/arjun2k01/esports-cart/issues

**Status:** Production-Ready ✅
**Last Updated:** December 13, 2025
