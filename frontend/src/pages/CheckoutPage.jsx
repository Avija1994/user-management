import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../context/CartContext'
import { orderService } from '../services/orderService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const initialForm = {
  first_name: '', last_name: '', email: '', phone: '',
  address: '', city: '', state: '', zip: '', country: 'US',
  payment_method: 'cod', notes: '',
}

export default function CheckoutPage() {
  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const { cartItems, total, clearCart } = useCart()
  const navigate = useNavigate()

  const shipping = total >= 50 ? 0 : 5
  const grandTotal = total + shipping

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (cartItems.length === 0) { toast.error('Your cart is empty.'); return }
    setLoading(true)
    try {
      await orderService.create({
        shipping_address: `${form.address}, ${form.city}, ${form.state} ${form.zip}, ${form.country}`,
        payment_method: form.payment_method,
        notes: form.notes,
      })
      toast.success('Order placed successfully!')
      clearCart()
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Checkout</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/cart" className="text-white">Cart</Link></li>
          <li className="breadcrumb-item text-white active">Checkout</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              {/* Billing */}
              <div className="col-lg-7">
                <h4 className="mb-4">Billing Information</h4>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="form-label">First Name *</label>
                    <input name="first_name" required value={form.first_name} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Last Name *</label>
                    <input name="last_name" required value={form.last_name} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Email *</label>
                    <input name="email" type="email" required value={form.email} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-6">
                    <label className="form-label">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address *</label>
                    <input name="address" required value={form.address} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City *</label>
                    <input name="city" required value={form.city} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">State</label>
                    <input name="state" value={form.state} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">ZIP Code *</label>
                    <input name="zip" required value={form.zip} onChange={handleChange} className="form-control" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Country</label>
                    <select name="country" value={form.country} onChange={handleChange} className="form-select">
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="CA">Canada</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Order Notes</label>
                    <textarea name="notes" rows={3} value={form.notes} onChange={handleChange} className="form-control" placeholder="Notes about your order..." />
                  </div>
                </div>

                {/* Payment Method */}
                <h4 className="mt-4 mb-3">Payment Method</h4>
                <div className="bg-light rounded p-4">
                  {[
                    { value: 'cod', label: 'Cash on Delivery' },
                    { value: 'bank_transfer', label: 'Direct Bank Transfer' },
                    { value: 'card', label: 'Credit/Debit Card' },
                  ].map(pm => (
                    <div className="form-check mb-2" key={pm.value}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="payment_method"
                        id={pm.value}
                        value={pm.value}
                        checked={form.payment_method === pm.value}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor={pm.value}>{pm.label}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-5">
                <div className="bg-light rounded p-4">
                  <h4 className="mb-4">Your Order</h4>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr><th>Product</th><th className="text-end">Subtotal</th></tr>
                      </thead>
                      <tbody>
                        {cartItems.map(item => (
                          <tr key={item.id}>
                            <td>{item.product?.name} × {item.quantity}</td>
                            <td className="text-end">${(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <th>Subtotal</th>
                          <td className="text-end">${total.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <th>Shipping</th>
                          <td className="text-end">{shipping === 0 ? <span className="text-success">Free</span> : `$${shipping.toFixed(2)}`}</td>
                        </tr>
                        <tr className="table-active">
                          <th>Total</th>
                          <td className="text-end text-primary fw-bold">${grandTotal.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 mt-2"
                    disabled={loading || cartItems.length === 0}
                  >
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Placing Order...</> : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </>
  )
}
