# Low-Level Design (LLD)
## Project: Fruitables — Organic E-Commerce Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Prepared by:** Architect Agent

---

## 1. Database Entity Details

### 1.1 users
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL, UNIQUE | |
| password | VARCHAR(255) | NOT NULL | bcrypt |
| role | ENUM('customer','admin') | DEFAULT 'customer' | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### 1.2 categories
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| slug | VARCHAR(100) | NOT NULL, UNIQUE |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 1.3 products
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| category_id | BIGINT UNSIGNED | FK → categories.id | |
| name | VARCHAR(255) | NOT NULL | |
| slug | VARCHAR(255) | NOT NULL, UNIQUE | |
| description | TEXT | | |
| price | DECIMAL(10,2) | NOT NULL | |
| unit | VARCHAR(50) | DEFAULT 'kg' | e.g. kg, piece |
| image | VARCHAR(500) | | relative storage path |
| stock | INT | DEFAULT 0 | |
| rating | DECIMAL(3,2) | DEFAULT 0.00 | avg rating |
| is_featured | TINYINT(1) | DEFAULT 0 | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### 1.4 cart_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| user_id | BIGINT UNSIGNED | FK → users.id |
| product_id | BIGINT UNSIGNED | FK → products.id |
| quantity | INT | NOT NULL, DEFAULT 1 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |
| UNIQUE KEY | (user_id, product_id) | |

### 1.5 orders
| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT | |
| user_id | BIGINT UNSIGNED | FK → users.id | |
| first_name | VARCHAR(100) | NOT NULL | |
| last_name | VARCHAR(100) | NOT NULL | |
| company_name | VARCHAR(255) | | |
| address | VARCHAR(500) | NOT NULL | |
| city | VARCHAR(100) | NOT NULL | |
| country | VARCHAR(100) | NOT NULL | |
| postcode | VARCHAR(20) | NOT NULL | |
| mobile | VARCHAR(20) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| order_notes | TEXT | | |
| shipping_method | VARCHAR(100) | NOT NULL | |
| payment_method | VARCHAR(100) | NOT NULL | |
| subtotal | DECIMAL(10,2) | NOT NULL | |
| shipping_cost | DECIMAL(10,2) | DEFAULT 0.00 | |
| total | DECIMAL(10,2) | NOT NULL | |
| status | ENUM('pending','processing','shipped','delivered','cancelled') | DEFAULT 'pending' | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### 1.6 order_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| order_id | BIGINT UNSIGNED | FK → orders.id |
| product_id | BIGINT UNSIGNED | FK → products.id |
| product_name | VARCHAR(255) | NOT NULL (snapshot) |
| price | DECIMAL(10,2) | NOT NULL (snapshot) |
| quantity | INT | NOT NULL |
| total | DECIMAL(10,2) | NOT NULL |

### 1.7 testimonials
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| designation | VARCHAR(255) | |
| image | VARCHAR(500) | |
| comment | TEXT | NOT NULL |
| rating | TINYINT | DEFAULT 5 |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### 1.8 contacts
| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGINT UNSIGNED | PK, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| email | VARCHAR(255) | NOT NULL |
| message | TEXT | NOT NULL |
| created_at | TIMESTAMP | |

---

## 2. Laravel Controller Methods

### AuthController
```
register(RegisterRequest $request): JsonResponse
  - Validate: name, email, password, password_confirmation
  - Hash password → User::create()
  - Return JWT token

login(LoginRequest $request): JsonResponse
  - Validate: email, password
  - Auth::attempt() → JWTAuth::fromUser()
  - Return user + token

logout(): JsonResponse
  - JWTAuth::invalidate()
```

### ProductController
```
index(Request $request): JsonResponse
  - Params: category, min_price, max_price, search, sort, page
  - ProductService::getFiltered()
  - Return paginated ProductResource collection

show(int $id): JsonResponse
  - ProductService::findById($id)
  - Return ProductResource with related products
```

### CartController
```
index(): JsonResponse
  - CartService::getCartForUser(auth()->id())

store(CartRequest $request): JsonResponse
  - CartService::addItem(user_id, product_id, quantity)

update(int $id, CartRequest $request): JsonResponse
  - CartService::updateQuantity(cart_item_id, quantity)

destroy(int $id): JsonResponse
  - CartService::removeItem(cart_item_id)
```

### OrderController
```
store(OrderRequest $request): JsonResponse
  - OrderService::placeOrder(user_id, billing_data, cart_items)
  - Clears cart after order
  - Returns order with items

index(): JsonResponse
  - Returns paginated order history for auth user
```

---

## 3. React Component Specifications

### ProductCard
```jsx
Props: { product: { id, name, price, unit, image, category, description } }
State: none (presentational)
Actions: onAddToCart(product) → CartContext.addItem
Renders: image, category badge, name, description (truncated), price, Add to Cart button
```

### CartContext
```js
State: { items: [], itemCount, subtotal }
Actions:
  addItem(product, qty=1)     → POST /api/cart
  removeItem(cartItemId)      → DELETE /api/cart/:id
  updateQuantity(id, qty)     → PUT /api/cart/:id
  clearCart()                 → local state clear
  fetchCart()                 → GET /api/cart → populate on login
```

### useAuth Hook
```js
Returns: { user, token, login(credentials), logout(), register(data), isAuthenticated }
- Persists token in localStorage
- Sets Axios default Authorization header on token change
```

---

## 4. API Request / Response Samples

### GET /api/products?category=fruits&page=1
```json
{
  "data": [
    {
      "id": 1,
      "name": "Grapes",
      "slug": "grapes",
      "price": "4.99",
      "unit": "kg",
      "image": "/storage/products/grapes.jpg",
      "category": { "id": 3, "name": "Fruits", "slug": "fruits" },
      "rating": 4.5
    }
  ],
  "meta": { "current_page": 1, "last_page": 3, "per_page": 8, "total": 24 }
}
```

### POST /api/orders (Request)
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main Street",
  "city": "New York",
  "country": "USA",
  "postcode": "10001",
  "mobile": "+1234567890",
  "email": "john@example.com",
  "shipping_method": "free",
  "payment_method": "bank_transfer",
  "order_notes": ""
}
```

---

## 5. Frontend Route Map

| Route | Component | Auth Required |
|-------|-----------|---------------|
| / | HomePage | No |
| /shop | ShopPage | No |
| /shop/:slug | ShopDetailPage | No |
| /cart | CartPage | Yes |
| /checkout | CheckoutPage | Yes |
| /orders | OrderHistoryPage | Yes |
| /testimonials | TestimonialsPage | No |
| /contact | ContactPage | No |
| /login | LoginPage | No |
| /register | RegisterPage | No |
| * | NotFoundPage | No |
