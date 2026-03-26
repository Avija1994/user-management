import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'
import Spinner from './components/Spinner'

// ---------------Lazy Loading component-----------------------------------------
import React,{Suspense} from 'react'
const ShopPage = React.lazy(() => import('./pages/ShopPage'))
const ShopDetailPage = React.lazy(() => import('./pages/ShopDetailPage'))
const CartPage = React.lazy(() => import('./pages/CartPage'))
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'))
const TestimonialsPage = React.lazy(() => import('./pages/TestimonialsPage'))
const ContactPage = React.lazy(() => import('./pages/ContactPage'))
const LoginPage = React.lazy(() => import('./pages/LoginPage'))
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'))
const OrderHistoryPage = React.lazy(() => import('./pages/OrderHistoryPage'))


import HomePage          from './pages/HomePage'
import NotFoundPage      from './pages/NotFoundPage'



function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Suspense fallback={<div className="text-center py-5"><Spinner /></div>}>
              <Routes>
                <Route path="/shop"        element={<ShopPage />} />
                <Route path="/shop/:slug"    element={<ShopDetailPage />} />
                <Route path="/cart"          element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
                <Route path="/checkout"      element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                <Route path="/testimonials"  element={<TestimonialsPage />} />
                <Route path="/contact"       element={<ContactPage />} />
                <Route path="/login"         element={<LoginPage />} />
                <Route path="/register"      element={<RegisterPage />} />
                <Route path="/orders"        element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
              </Routes>
          </Suspense>
          <Routes>
            <Route path="/"              element={<HomePage />} />
            <Route path="*"              element={<NotFoundPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
