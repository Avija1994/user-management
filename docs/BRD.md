# Business Requirements Document (BRD)
## Project: Fruitables — Organic Fruits & Vegetables E-Commerce Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Prepared by:** Analyst Agent

---

## 1. Executive Summary

Fruitables is a full-featured e-commerce web application for selling 100% organic fruits, vegetables, bread, and meat products. The platform enables customers to browse products by category, manage a shopping cart, place orders via a checkout flow, and contact the business. The backend exposes RESTful APIs consumed by a React single-page application, backed by a MySQL relational database and a Laravel PHP framework.

---

## 2. Business Objectives

| # | Objective |
|---|-----------|
| 1 | Provide an intuitive online storefront for organic food products |
| 2 | Enable product discovery via category filters and keyword search |
| 3 | Support a full cart-to-checkout purchase flow |
| 4 | Allow users to register, log in, and manage their account |
| 5 | Provide a contact channel (form + map) for customer engagement |
| 6 | Display customer testimonials to build social proof |
| 7 | Support an admin interface to manage products, categories, and orders |

---

## 3. Scope

### In Scope
- Public-facing storefront (Home, Shop, Shop Detail, Cart, Checkout, Testimonials, Contact, 404)
- User authentication (Register / Login / Logout)
- Product catalog management (CRUD) with category tagging
- Shopping cart (add, remove, update quantity, apply coupon)
- Order placement and order history
- Customer testimonials display
- Contact form submission
- Search by keyword
- Responsive design matching the Fruitables HTML template

### Out of Scope
- Payment gateway integration (future phase)
- Inventory/warehouse management
- Mobile native apps

---

## 4. Stakeholders

| Role | Responsibility |
|------|---------------|
| Business Owner | Define product catalogue, pricing, promotions |
| End Customer | Browse, search, purchase products |
| Admin | Manage products, categories, orders, users |
| Developer | Build and maintain the platform |

---

## 5. Functional Requirements

### 5.1 Home Page
- FR-01: Display hero carousel with promotional banners (Fruits / Vegetables)
- FR-02: Show 4 feature highlights (Free Shipping, Security Payment, 30-Day Return, 24/7 Support)
- FR-03: Display tabbed product grid filtered by category (All, Vegetables, Fruits, Bread, Meat)
- FR-04: Show "Best Sellers" section
- FR-05: Display customer testimonials carousel
- FR-06: Newsletter subscription widget in footer

### 5.2 Shop Page
- FR-07: Sidebar with category filter, price range slider, and star rating filter
- FR-08: Product grid with pagination and sort options
- FR-09: Keyword search bar
- FR-10: Product card with image, name, price, category badge, and "Add to Cart" button

### 5.3 Product Detail Page
- FR-11: Product images, name, price, description, category
- FR-12: Quantity selector with +/- buttons
- FR-13: Add to Cart button
- FR-14: Related products section

### 5.4 Cart Page
- FR-15: Cart table with product image, name, unit price, quantity controls, line total, and remove button
- FR-16: Coupon code field with Apply button
- FR-17: Cart summary (subtotal, shipping, total)
- FR-18: "Proceed to Checkout" button

### 5.5 Checkout Page
- FR-19: Billing details form (first name, last name, company, address, city, country, postcode, mobile, email)
- FR-20: Option to ship to a different address
- FR-21: Order notes textarea
- FR-22: Order summary table
- FR-23: Shipping method selection (Free / Flat Rate / Local Pickup)
- FR-24: Payment method selection (Bank Transfer / Check / Cash on Delivery / PayPal)
- FR-25: Place Order button

### 5.6 Testimonials Page
- FR-26: Grid of customer review cards (photo, name, designation, star rating, comment)

### 5.7 Contact Page
- FR-27: Google Maps embed
- FR-28: Contact form (name, email, message, submit)
- FR-29: Business info cards (Address, Email, Phone)

### 5.8 Authentication
- FR-30: User Registration (name, email, password)
- FR-31: User Login with JWT token
- FR-32: Protected routes for Cart, Checkout, Order History

### 5.9 Search
- FR-33: Full-screen modal search by keyword, returning matching products

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-01 | Page load < 2 seconds on standard broadband |
| NFR-02 | API response time < 500 ms for product listing |
| NFR-03 | HTTPS enforced in production |
| NFR-04 | JWT tokens expire in 24 hours |
| NFR-05 | Mobile-responsive UI (Bootstrap 5 grid) |
| NFR-06 | MySQL queries must use indexed columns for filtering |
| NFR-07 | Input validation on all forms (frontend + backend) |

---

## 7. Assumptions & Constraints

- Product images are uploaded and stored server-side (Laravel storage)
- Prices are in USD
- The application will initially deploy on a single server
- React (Vite or CRA), Laravel 10+, MySQL 8+ are the chosen stack

---

## 8. Acceptance Criteria

- All listed pages are accessible and match the Fruitables HTML template design
- Full cart → checkout flow can be completed by an authenticated user
- Admin can add/edit/delete products and categories via API
- Unit test coverage ≥ 70% on critical business logic
- Zero critical security vulnerabilities
