import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth()
  const [items, setItems]  = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setItems([])
    }
  }, [isAuthenticated])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setItems(data.data)
    } catch (_) {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const addItem = async (productId, quantity = 1) => {
    const { data } = await api.post('/cart', { product_id: productId, quantity })
    await fetchCart()
    return data
  }

  const updateQuantity = async (cartItemId, quantity) => {
    await api.put(`/cart/${cartItemId}`, { quantity })
    await fetchCart()
  }

  const removeItem = async (cartItemId) => {
    await api.delete(`/cart/${cartItemId}`)
    await fetchCart()
  }

  const clearCart = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal  = items.reduce((sum, i) => sum + i.quantity * parseFloat(i.product?.price ?? 0), 0)

  return (
    <CartContext.Provider value={{ cartItems: items, items, itemCount, total: subtotal, subtotal, loading, addItem, removeItem, updateItem: updateQuantity, updateQuantity, fetchCart, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
