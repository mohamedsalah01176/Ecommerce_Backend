<h2>to use backEnd</h2>
<p>cd back-end</p>
<p>npm run start</p>
# 🛒 FurniHome Backend

This is the **backend API** for an electronic e-commerce platform built with **Node.js**, **Express**, and **MongoDB**. It handles all server-side operations such as authentication, product and order management, and admin functionalities.

## 🚀 Tech Stack

- **Node.js**
- **Express**
- **MongoDB** with Mongoose
- **JWT Authentication**
- **Multer** for file uploads
- **Stripe** (optional for payments)
- **Cloudinary** (optional for image hosting)
- **CORS**, **dotenv**, **Helmet** for security and configuration


🧱 Pattern Explanation
  This project follows the MVCS (Model-View-Controller-Service) pattern:

    Model – Defines data structure using Mongoose.
    
    View – Not present here (handled on the frontend using Angular).
    
    Controller – Manages request and response objects.
    
    Service – Contains business logic, separating it from controllers.
    
    Routes – Map endpoints to controllers.
    
    Utils & Middleware – Reusable logic and request preprocessing.


## 📦 Features

- ✅ User Registration & Login (with JWT)
- 🔐 Role-based Access Control (Admin / User)
- 🛍️ Product CRUD (Admin)
- 📂 Upload product images
- 📦 Category & Coupon Management
- 📬 Order Placement and Tracking
- 💳 (Optional) Online Payments Integration
- 📊 Admin Dashboard Support
