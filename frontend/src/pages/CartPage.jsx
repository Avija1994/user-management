import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const FALLBACK = [
  '/img/vegetable-item-1.jpg', '/img/vegetable-item-2.jpg',
  '/img/vegetable-item-3.png', '/img/vegetable-item-4.jpg',
  '/img/vegetable-item-5.jpg', '/img/vegetable-item-6.jpg',
]

export default function CartPage() {
  const { cartItems, loading, updateItem, removeItem, total } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [coupon, setCoupon] = useState('')

  const shipping = total >= 50 ? 0 : 3
  const grandTotal = total + shipping

  const handleUpdate = async (id, qty) => {
    if (qty < 1) return
    try { await updateItem(id, qty) }
    catch { toast.error('Failed to update quantity.') }
  }

  const handleRemove = async (id) => {
    try {
      await removeItem(id)
      toast.success('Item removed from cart.')
    } catch { toast.error('Failed to remove item.') }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please log in to checkout.')
      navigate('/login')
    } else {
      navigate('/checkout')
    }
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Cart</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Cart</li>
        </ol>
      </div>

      {/* Cart Page Start */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          {loading ? (
            <Spinner />
          ) : cartItems.length === 0 ? (
            <div className="text-center py-5">
              <i className="fa fa-shopping-cart fa-4x text-muted mb-4 d-block"></i>
              <h4 className="text-muted mb-4">Your cart is empty</h4>
              <Link to="/shop" className="btn btn-primary border-secondary rounded-pill px-5 py-3">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <>
              {/* Table */}
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th scope="col">Products</th>
                      <th scope="col">Name</th>
                      <th scope="col">Price</th>
                      <th scope="col">Quantity</th>
                      <th scope="col">Total</th>
                      <th scope="col">Handle</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, idx) => {
                      const price  = parseFloat(item.product?.price || 0)
                      const imgSrc = item.product?.image_url
                        || (item.product?.image ? `${BASE_URL}/storage/${item.product.image}` : null)
                        || FALLBACK[idx % FALLBACK.length]
                      return (
                        <tr key={item.id}>
                          <th scope="row">
                            <div className="d-flex align-items-center">
                              <img
                                src={imgSrc}
                                className="img-fluid me-5 rounded-circle"
                                style={{ width: 80, height: 80, objectFit: 'cover' }}
                                alt={item.product?.name}
                                onError={e => { e.target.src = FALLBACK[idx % FALLBACK.length] }}
                              />
                            </div>
                          </th>
                          <td>
                            <p className="mb-0 mt-4">
                              <Link to={`/shop/${item.product?.slug}`} className="text-dark text-decoration-none">
                                {item.product?.name}
                              </Link>
                            </p>
                          </td>
                          <td><p className="mb-0 mt-4">${price.toFixed(2)}</p></td>
                          <td>
                            <div className="input-group quantity mt-4" style={{ width: 100 }}>
                              <div className="input-group-btn">
                                <button
                                  className="btn btn-sm btn-minus rounded-circle bg-light border"
                                  onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                >
                                  <i className="fa fa-minus"></i>
                                </button>
                              </div>
                              <input
                                type="text"
                                className="form-control form-control-sm text-center border-0"
                                value={item.quantity}
                                readOnly
                              />
                              <div className="input-group-btn">
                                <button
                                  className="btn btn-sm btn-plus rounded-circle bg-light border"
                                  onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                >
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td><p className="mb-0 mt-4">${(price * item.quantity).toFixed(2)}</p></td>
                          <td>
                            <button
                              className="btn btn-md rounded-circle bg-light border mt-4"
                              onClick={() => handleRemove(item.id)}
                            >
                              <i className="fa fa-times text-danger"></i>
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Coupon + Actions */}
              <div className="mt-5">
                <input
                  type="text"
                  className="border-0 border-bottom rounded me-5 py-3 mb-4"
                  placeholder="Coupon Code"
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                />
                <button
                  className="btn border-secondary rounded-pill px-4 py-3 text-primary"
                  type="button"
                  onClick={() => toast.info('Coupon feature coming soon!')}
                >
                  Apply Coupon
                </button>
              </div>

              {/* Cart Total */}
              <div className="row g-4 justify-content-end">
                <div className="col-8"></div>
                <div className="col-sm-8 col-md-7 col-lg-6 col-xl-4">
                  <div className="bg-light rounded">
                    <div className="p-4">
                      <h1 className="display-6 mb-4">Cart <span className="fw-normal">Total</span></h1>
                      <div className="d-flex justify-content-between mb-4">
                        <h5 className="mb-0 me-4">Subtotal:</h5>
                        <p className="mb-0">${total.toFixed(2)}</p>
                      </div>
                      <div className="d-flex justify-content-between">
                        <h5 className="mb-0 me-4">Shipping</h5>
                        <div>
                          {shipping === 0
                            ? <p className="mb-0 text-success">Free (over $50)</p>
                            : <p className="mb-0">Flat rate: ${shipping.toFixed(2)}</p>
                          }
                        </div>
                      </div>
                    </div>
                    <div className="py-4 mb-4 border-top border-bottom d-flex justify-content-between">
                      <h5 className="mb-0 ps-4 me-4">Total</h5>
                      <p className="mb-0 pe-4">${grandTotal.toFixed(2)}</p>
                    </div>
                    <div className="d-flex justify-content-center pb-4">
                      <button
                        className="btn border-secondary rounded-pill px-4 py-3 text-primary"
                        onClick={handleCheckout}
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Cart Page End */}

      <Footer />
    </>
  )
}
