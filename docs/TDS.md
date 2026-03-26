# Technical Design Specification (TDS)
## Project: Fruitables — Organic E-Commerce Platform

**Version:** 1.0  
**Date:** March 24, 2026  
**Prepared by:** Architect Agent

---

## 1. React Frontend Technical Specification

### 1.1 Project Setup
```bash
npm create vite@latest frontend -- --template react
cd frontend
npm install axios react-router-dom bootstrap @popperjs/core
npm install react-toastify react-loading-skeleton
```

### 1.2 Vite Config (vite.config.js)
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000'
    }
  }
})
```

### 1.3 Axios Instance (src/services/api.js)
```js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
```

### 1.4 AuthContext (src/context/AuthContext.jsx)
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      api.get('/auth/me').then(r => setUser(r.data)).catch(() => logout())
    }
  }, [token])

  const login = async (credentials) => {
    const { data } = await api.post('/auth/login', credentials)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    api.post('/auth/logout').catch(() => {})
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload)
    localStorage.setItem('token', data.token)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### 1.5 CartContext (src/context/CartContext.jsx)
```jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems] = useState([])

  useEffect(() => {
    if (isAuthenticated) fetchCart()
    else setItems([])
  }, [isAuthenticated])

  const fetchCart = () => api.get('/cart').then(r => setItems(r.data.data))

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { product_id: productId, quantity })
    fetchCart()
    return data
  }

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity })
    fetchCart()
  }

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`)
    fetchCart()
  }

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.quantity * parseFloat(i.product.price), 0)

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addItem, removeItem, updateQuantity, fetchCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
```

---

## 2. Laravel Backend Technical Specification

### 2.1 Project Setup
```bash
composer create-project laravel/laravel backend
cd backend
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret
```

### 2.2 .env Database Config
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=fruitables
DB_USERNAME=root
DB_PASSWORD=your_password
JWT_SECRET=generated_by_jwt_secret_command
JWT_TTL=1440
```

### 2.3 CORS Config (config/cors.php)
```php
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => false,
```

### 2.4 API Routes (routes/api.php)
```php
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('me', [AuthController::class, 'me']);
    });
});

Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);
Route::get('categories', [CategoryController::class, 'index']);
Route::get('testimonials', [TestimonialController::class, 'index']);
Route::post('contact', [ContactController::class, 'store']);

Route::middleware('auth:api')->group(function () {
    Route::apiResource('cart', CartController::class)->except(['show']);
    Route::apiResource('orders', OrderController::class)->only(['index', 'store']);
});
```

### 2.5 ProductController
```php
public function index(Request $request)
{
    $query = Product::with('category');

    if ($request->category) {
        $query->whereHas('category', fn($q) => $q->where('slug', $request->category));
    }
    if ($request->search) {
        $query->where('name', 'like', "%{$request->search}%");
    }
    if ($request->min_price) $query->where('price', '>=', $request->min_price);
    if ($request->max_price) $query->where('price', '<=', $request->max_price);

    $sort = $request->sort ?? 'created_at';
    $dir  = $request->dir ?? 'desc';
    $query->orderBy($sort, $dir);

    return ProductResource::collection($query->paginate(8));
}
```

### 2.6 OrderService
```php
public function placeOrder(int $userId, array $data): Order
{
    return DB::transaction(function () use ($userId, $data) {
        $cartItems = CartItem::where('user_id', $userId)->with('product')->get();

        $subtotal = $cartItems->sum(fn($i) => $i->quantity * $i->product->price);
        $shipping = $this->resolveShippingCost($data['shipping_method']);

        $order = Order::create([
            ...$data,
            'user_id'       => $userId,
            'subtotal'      => $subtotal,
            'shipping_cost' => $shipping,
            'total'         => $subtotal + $shipping,
        ]);

        foreach ($cartItems as $item) {
            OrderItem::create([
                'order_id'     => $order->id,
                'product_id'   => $item->product_id,
                'product_name' => $item->product->name,
                'price'        => $item->product->price,
                'quantity'     => $item->quantity,
                'total'        => $item->quantity * $item->product->price,
            ]);
        }

        CartItem::where('user_id', $userId)->delete();

        return $order->load('items');
    });
}

private function resolveShippingCost(string $method): float
{
    return match($method) {
        'flat_rate'    => 15.00,
        'local_pickup' => 8.00,
        default        => 0.00,   // free
    };
}
```

---

## 3. Environment Variables

### React (.env)
```
VITE_API_URL=http://localhost:8000/api
```

### Laravel (.env additions)
```
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

---

## 4. Running Locally

```bash
# Backend
cd backend
composer install
php artisan migrate --seed
php artisan storage:link
php artisan serve          # runs on :8000

# Frontend
cd frontend
npm install
npm run dev                # runs on :5173
```

---

## 5. File Upload (Product Images)
- Images stored in `storage/app/public/products/`
- Symlinked via `php artisan storage:link`
- URLs returned as `/storage/products/<filename>`
- Frontend displays: `{VITE_API_URL_BASE}/storage/products/<filename>`

---

## 6. Validation Rules

### RegisterRequest
```php
'name'     => 'required|string|max:255',
'email'    => 'required|email|unique:users',
'password' => 'required|min:8|confirmed',
```

### OrderRequest
```php
'first_name'      => 'required|string|max:100',
'last_name'       => 'required|string|max:100',
'address'         => 'required|string',
'city'            => 'required|string',
'country'         => 'required|string',
'postcode'        => 'required|string',
'mobile'          => 'required|string',
'email'           => 'required|email',
'shipping_method' => 'required|in:free,flat_rate,local_pickup',
'payment_method'  => 'required|in:bank_transfer,check,cash_on_delivery,paypal',
```
