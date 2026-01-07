# Nova-Cart

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/bishwajit1965/nova-cart?style=social)](https://github.com/bishwajit1965/nova-cart/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/bishwajit1965/nova-cart)](https://github.com/bishwajit1965/nova-cart/issues)
[![GitHub forks](https://img.shields.io/github/forks/bishwajit1965/nova-cart?style=social)](https://github.com/bishwajit1965/nova-cart/network)
[![Live Demo](https://img.shields.io/badge/Live-Demo-blueviolet)](https://your-demo-link.com)

**Nova-Cart** is a full-stack, feature-rich e-commerce platform demonstrating modern web development skills with a complete shopping experience, including authentication, cart, checkout, and admin management.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [Developer Challenges & Solutions](#developer-challenges--solutions)
- [Screenshots / GIFs](#screenshots--gifs)
- [Future Enhancements](#future-enhancements)
- [Deployment & Demo](#deployment--demo)
- [Portfolio & LinkedIn Usage](#portfolio--linkedin-usage)

---

## Project Overview

Nova-Cart is designed to provide seamless online shopping experiences while demonstrating full-stack development, modern UI, role-based dashboards, and payment integration.

**Purpose:**

- Showcase a scalable e-commerce platform for portfolio and career opportunities.
- Demonstrate React + Tailwind frontend, Node.js + Express backend, MongoDB, and Stripe payment integration.
- Highlight developer problem-solving skills (cart management, coupon logic, authentication, SEO).

---

## Tech Stack

| Layer          | Technology                                   |
| -------------- | -------------------------------------------- |
| Frontend       | React, Tailwind CSS, Vite                    |
| Backend        | Node.js, Express                             |
| Database       | MongoDB (Mongoose)                           |
| Authentication | JWT, Google/Facebook OAuth                   |
| Payments       | Stripe (mock & sandbox)                      |
| Others         | React Hot Toast, Framer Motion, Lucide Icons |

---

## Folder Structure

nova-cart/
│
├── client/ # Frontend
│ ├── components/ # UI components
│ ├── pages/ # Page components (Home, Checkout, etc.)
│ ├── services/ # API calls & hooks
│ └── App.jsx
│
├── server/ # Backend
│ ├── controllers/ # Business logic
│ ├── models/ # Mongoose models
│ ├── routes/ # API routes
│ ├── services/ # Utilities (email, PDF generation)
│ └── index.js # Entry point
│
└── README.md

---

## Setup Instructions

**Prerequisites:**

- Node.js >= 18
- MongoDB instance (local or cloud)
- Stripe sandbox account

**Steps:**

1. Clone the repository:

```bash
git clone https://github.com/bishwajit1965/nova-cart.git

```

## 2.Install dependencies:

cd client
npm install
cd ../server
npm install

## 3. Set environment variables in .env (server):

MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
STRIPE_KEY=<your_stripe_test_key>
EMAIL_USER=<email>
EMAIL_PASS=<email_password>

## 4. Start development servers:

cd server
npm run dev
cd ../client
npm run dev

## 5. Access the app: http://localhost:5173

## Features

- Authentication

- JWT-based login and registration

- Google & Facebook OAuth

- Role-based access (Client, Admin, Super Admin)

## Product & Cart

- Browse products and select variants

- Cart persists across refreshes

- Wishlist prevents duplicates with toast alerts

## Checkout & Orders

- Multi-step checkout with shipping address selection or new address

- Payment methods: COD, Card, Bkash, Nagad

- Coupon validation with max discount and ownership check

- Order confirmation emails

## Admin / Super Admin

- Admin: Manage products, orders, coupons, and stats

- Super Admin: Manage vendors, settings, and FAQs

## Newsletter & SEO

- Newsletter subscription with email validation

- SEO-optimized pages with Open Graph tags

## Developer Challenges & Solutions

- Cart Persistence: React Context + localStorage to prevent stale cart items

- Coupon Logic: Percentage/fixed discounts, max discount, user validation, no negative totals

- Order Submission: Prevent empty cart from creating orders

- Dynamic Forms: Adapt shipping form when saved addresses exist

- State Management: Smooth transitions with Framer Motion, preventing flicker

## Screenshots / GIFs

- Add screenshots or GIFs of:

- Home Page

- Product Page

- Cart Page

- Checkout Page

- Admin Dashboard

- Newsletter popup

## Future Enhancements

- Inventory management with low-stock notifications

- Vendor management (multi-seller)

- PDF invoice generation

- Enhanced analytics dashboard for Admin

## Deployment & Demo

- Frontend: Vercel / Netlify

- Backend: Render / Railway / Heroku

- Stripe sandbox integration for demo purchases

## Portfolio & LinkedIn Usage

- Showcase full-stack expertise, role-based dashboards, payment integration, and state management.

- Include screenshots/GIFs with bullet points for skills:

- React + Tailwind responsive UI

- Node.js + Express API

- MongoDB queries & schema design

- Stripe payments & coupon logic

- JWT + OAuth authentication

## Author

Bishwajit Paul
Full-stack Developer | GitHub

## Project Story

Nova-Cart is a full-stack e-commerce platform I built to understand real-world order flows, variant-based cart logic, and role-based dashboards. I focused heavily on data integrity, clean architecture, and realistic admin workflows rather than demo features.

## 🚧 Features Under Consideration (Planned Enhancements)

The following features are planned for future iterations of the project to enhance traceability, reliability, and administrative control. These are intentionally deferred and architecturally anticipated.

### 1. Order Audit Log (Admin / Super Admin)

- Track all order-related actions and state changes
- Log order status transitions (e.g., Pending → Shipped → Delivered)
- Record admin/system/user actions with timestamps
- Immutable, append-only audit history
- Useful for debugging, compliance, and dispute resolution

### 2. Product Audit Log

- Track price changes
- Track stock updates
- Log product visibility/status changes
- Record admin attribution for each action

### 3. User Activity Log

- Login and logout history
- Password reset events
- Role or plan changes
- Basis for future security monitoring

### 4. Order Versioning

- Snapshot order data at key lifecycle stages
- Prevent historical data drift when product or variant data changes
- Ensure invoice and refund consistency

### 5. Advanced Invoice System

- Multiple invoice versions per order
- Support for refunds and credit notes
- Invoice download history tracking

### 6. Global Admin Action Log

- Centralized log for all admin CRUD operations
- Covers products, categories, vendors, plans, and settings
- Improves accountability and traceability

### 7. Event-Based Notification System

- Notifications triggered by audit log events
- Admin alerts for critical system changes
- User notifications for order lifecycle updates

### 8. Soft Delete and Restore System

- Soft delete support for orders, products, and users
- Restore functionality with audit tracking
- Prevents accidental permanent data loss

### 9. Reporting and Analytics Layer

- Order lifecycle analytics
- Admin activity insights
- Revenue and order-change correlation reports

## A live demo link for recruiters or clients

Feature complete – Version 1.0.0

<!-- ![Home Page](https://i.ibb.co.com/Q3s9YK8b/web-Dev-Pro-F.png)

![Home Page](https://i.ibb.co/Q3s9YK8b/web-Dev-Pro-F.png) -->

<img src="https://i.ibb.co/Q3s9YK8b/web-Dev-Pro-F.png" alt="Home Page" width="100" height="100"/>
