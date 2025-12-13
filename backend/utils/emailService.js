import nodemailer from 'nodemailer';
// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Email template for order confirmation
const orderConfirmationTemplate = (order) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #007bff; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; margin-top: 20px; }
        .order-details { margin: 20px 0; }
        .order-item { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #ddd; }
        .total { font-weight: bold; font-size: 18px; margin-top: 20px; text-align: right; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Order Confirmation</h1>
        </div>
        <div class="content">
          <p>Thank you for your order! Here are your order details:</p>
          <div class="order-details">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <div class="order-items">
            <h3>Items:</h3>
            ${order.items.map(item => `
              <div class="order-item">
                <span>${item.product.name} x ${item.quantity}</span>
                <span>₹${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            `).join('')}
          </div>
          <div class="total">
            <p>Total: ₹${order.totalPrice.toFixed(2)}</p>
          </div>
          <p style="margin-top: 30px;">We'll notify you as soon as your order is shipped!</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ESports Cart. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

// Email template for order shipping notification
const orderShippingTemplate = (order) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #28a745; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; margin-top: 20px; }
        .tracking-info { background-color: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your Order Has Shipped!</h1>
        </div>
        <div class="content">
          <p>Great news! Your order has been shipped and is on its way to you.</p>
          <div class="tracking-info">
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'N/A'}</p>
            <p><strong>Expected Delivery:</strong> 3-5 business days</p>
          </div>
          <p>You can track your order status anytime on our website.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ESports Cart. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

// Email template for password reset
const passwordResetTemplate = (resetUrl) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #ffc107; color: #333; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; margin-top: 20px; }
        .reset-btn { display: inline-block; background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        .warning { color: #d32f2f; font-size: 12px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>We received a request to reset your password. Click the button below to create a new password:</p>
          <a href="${resetUrl}" class="reset-btn">Reset Password</a>
          <p>Or copy and paste this link in your browser:</p>
          <p style="word-break: break-all; background-color: #e8e8e8; padding: 10px;">${resetUrl}</p>
          <p class="warning">This link will expire in 24 hours. If you didn't request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
          <p>&copy; 2024 ESports Cart. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`;

// Send order confirmation email
const sendOrderConfirmation = async (email, order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Order Confirmation - Order #${order._id}`,
      html: orderConfirmationTemplate(order),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, message: error.message };
  }
};

// Send order shipping notification email
const sendOrderShipping = async (email, order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Your Order Has Shipped - Order #${order._id}`,
      html: orderShippingTemplate(order),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Shipping notification email sent to ${email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending shipping notification email:', error);
    return { success: false, message: error.message };
  }
};

// Send password reset email
const sendPasswordReset = async (email, resetUrl) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Password Reset Request - ESports Cart',
      html: passwordResetTemplate(resetUrl),
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return { success: false, message: error.message };
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, userName) => {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 5px 5px 0 0; }
            .content { background-color: #f8f9fa; padding: 30px; text-align: center; }
            .welcome-text { font-size: 16px; line-height: 1.6; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to ESports Cart!</h1>
            </div>
            <div class="content">
              <p class="welcome-text">Hi ${userName},</p>
              <p class="welcome-text">Welcome to ESports Cart! We're excited to have you on board. Explore our amazing collection of gaming gear and peripherals.</p>
              <p class="welcome-text">If you have any questions, feel free to reach out to our support team.</p>
              <p class="welcome-text">Happy shopping!</p>
            </div>
            <div class="footer">
              <p>&copy; 2024 ESports Cart. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to ESports Cart!',
      html,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return { success: false, message: error.message };
  }
};

export {
  sendOrderConfirmation,
  sendOrderShipping,
  sendPasswordReset,
  sendWelcomeEmail,
};
