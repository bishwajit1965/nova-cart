# Nova-Cart

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
git clone https://github.com/your-username/nova-cart.git

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

Provide a live demo link for recruiters or clients
