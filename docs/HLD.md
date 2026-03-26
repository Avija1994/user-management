# High-Level Design (HLD)
## Project: Fruitables — Organic E-Commerce Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Prepared by:** Architect Agent

---

## 1. System Architecture Overview

The platform follows a **three-tier client-server architecture**:

```
┌──────────────────────────────────────────────────────────┐
│                     CLIENT TIER                          │
│  React SPA (Vite + React 18 + React Router v6)           │
│  Axios HTTP client  │  Bootstrap 5  │  Context API       │
└──────────────────────────┬───────────────────────────────┘
                           │ HTTPS / REST JSON API
┌──────────────────────────▼───────────────────────────────┐
│                     APPLICATION TIER                     │
│  Laravel 10 (PHP 8.2)                                    │
│  Controllers → Services → Repositories                   │
│  JWT Authentication (tymon/jwt-auth)                     │
│  Laravel Sanctum (optional cookie auth)                  │
└──────────────────────────┬───────────────────────────────┘
                           │ PDO / Eloquent ORM
┌──────────────────────────▼───────────────────────────────┐
│                       DATA TIER                          │
│  MySQL 8.0                                               │
│  Tables: users, categories, products, cart_items,        │
│          orders, order_items, testimonials, contacts     │
└──────────────────────────────────────────────────────────┘
```

---

## 2. Component Diagram

### Frontend (React)
```
src/
├── pages/
│   ├── HomePage
│   ├── ShopPage
│   ├── ShopDetailPage
│   ├── CartPage
│   ├── CheckoutPage
│   ├── TestimonialsPage
│   ├── ContactPage
│   ├── LoginPage
│   ├── RegisterPage
│   └── NotFoundPage
├── components/
│   ├── Navbar
│   ├── Footer
│   ├── ProductCard
│   ├── CartItem
│   ├── HeroCarousel
│   ├── CategoryTabs
│   ├── PriceRangeSlider
│   ├── SearchModal
│   ├── TestimonialCard
│   └── Spinner
├── services/
│   ├── api.js           (Axios instance)
│   ├── productService.js
│   ├── cartService.js
│   ├── orderService.js
│   └── authService.js
├── hooks/
│   ├── useCart.js
│   ├── useAuth.js
│   └── useProducts.js
└── context/
    ├── AuthContext.jsx
    └── CartContext.jsx
```

### Backend (Laravel)
```
app/
├── Http/
│   └── Controllers/
│       ├── AuthController
│       ├── ProductController
│       ├── CategoryController
│       ├── CartController
│       ├── OrderController
│       ├── TestimonialController
│       └── ContactController
├── Services/
│   ├── ProductService
│   ├── CartService
│   └── OrderService
├── Repositories/
│   ├── ProductRepository
│   ├── CartRepository
│   └── OrderRepository
├── Models/
│   ├── User, Category, Product
│   ├── CartItem, Order, OrderItem
│   ├── Testimonial, Contact
└── Http/Resources/ (API Resource DTOs)
```

---

## 3. API Design (REST)

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | Public |
| POST | /api/auth/login | Login, returns JWT | Public |
| POST | /api/auth/logout | Invalidate token | Private |
| GET | /api/products | List products (filter, sort, paginate) | Public |
| GET | /api/products/{id} | Product detail | Public |
| GET | /api/categories | List categories | Public |
| GET | /api/cart | Get user's cart | Private |
| POST | /api/cart | Add item to cart | Private |
| PUT | /api/cart/{id} | Update cart item qty | Private |
| DELETE | /api/cart/{id} | Remove cart item | Private |
| POST | /api/orders | Place order | Private |
| GET | /api/orders | User order history | Private |
| GET | /api/testimonials | List testimonials | Public |
| POST | /api/contact | Submit contact form | Public |

---

## 4. Data Flow

### Add to Cart Flow
```
User clicks "Add to Cart"
  → React CartContext.addItem()
  → Axios POST /api/cart (JWT header)
  → CartController → CartService → CartRepository
  → MySQL INSERT cart_items
  → 200 Response → Update cart state → Badge count updates
```

### Checkout Flow
```
User fills Billing Details & clicks "Place Order"
  → React validates form
  → Axios POST /api/orders {billing, items, shipping_method, payment_method}
  → OrderController → OrderService
    → Creates order record
    → Creates order_items records
    → Clears cart_items for user
  → 201 Response → Redirect to Order Confirmation
```

---

## 5. Security Architecture

- **JWT Authentication**: All private routes require `Authorization: Bearer <token>`
- **CORS**: Laravel CORS configured for React dev server origin
- **Input Sanitization**: Laravel FormRequest validation on all inputs
- **Password Hashing**: bcrypt via Laravel Hash facade
- **SQL Injection Prevention**: Eloquent ORM parameterized queries
- **Rate Limiting**: Laravel throttle middleware on auth endpoints

---

## 6. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | React | 18.x |
| Frontend Build | Vite | 5.x |
| Frontend Routing | React Router | 6.x |
| HTTP Client | Axios | 1.x |
| CSS Framework | Bootstrap | 5.x |
| Backend Framework | Laravel | 10.x |
| Backend Language | PHP | 8.2 |
| Auth Library | tymon/jwt-auth | 2.x |
| ORM | Eloquent (Laravel) | built-in |
| Database | MySQL | 8.0 |
| API Format | JSON REST | - |

---

## 7. Deployment Architecture

```
Browser → Nginx → React build (dist/)
             ↓
           Nginx → PHP-FPM → Laravel (public/)
             ↓
           MySQL 8.0 (same or separate host)
```

---

## 8. Key Design Decisions

1. **SPA + REST API** rather than server-rendered Blade templates to allow independent frontend scaling
2. **JWT** preferred over sessions for stateless API calls from React
3. **Laravel Repository Pattern** for separation of data access from business logic
4. **React Context API** (not Redux) for cart and auth state — sufficient complexity level for this app
5. **Bootstrap 5** retained from original HTML template for visual fidelity
