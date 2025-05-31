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

- ## 📁 Folder Structure
- 
/FurniHome-Backend
├── controllers/      # Route handlers (handle HTTP requests/responses)
├── middleware/       # Auth, error handling, validators
├── models/           # Mongoose schemas (MongoDB data structure)
├── routes/           # Express route definitions, grouped by module
├── services/         # Business logic and data processing
├── utils/            # Utility functions (e.g. file uploads, helpers)
├── .env              # Environment variables
├── main.js 

## 📦 Features

- ✅ User Registration & Login (with JWT)
- 🔐 Role-based Access Control (Admin / User)
- 🛍️ Product CRUD (Admin)
- 📂 Upload product images
- 📦 Category & Coupon Management
- 📬 Order Placement and Tracking
- 💳 (Optional) Online Payments Integration
- 📊 Admin Dashboard Support
