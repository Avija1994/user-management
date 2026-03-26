import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { orderService } from '../services/orderService'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const statusColors = {
  pending:    'warning',
  processing: 'info',
  shipped:    'primary',
  delivered:  'success',
  cancelled:  'danger',
}

export default function OrderHistoryPage() {
  const [orders, setOrders]   = useState([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    orderService.getAll()
      .then(res => setOrders(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">My Orders</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Orders</li>
        </ol>
      </div>

      <div className="container py-5">
        {loading ? (
          <Spinner />
        ) : orders.length === 0 ? (
          <div className="text-center py-5">
            <i className="fa fa-box-open fa-4x text-muted mb-3"></i>
            <h4 className="text-muted">No orders yet</h4>
            <Link to="/shop" className="btn btn-primary rounded-pill mt-3">Start Shopping</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Order #</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Items</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <>
                    <tr key={order.id}>
                      <td><strong>#{order.id}</strong></td>
                      <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge bg-${statusColors[order.status] || 'secondary'}`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                        </span>
                      </td>
                      <td className="text-primary fw-bold">${parseFloat(order.total).toFixed(2)}</td>
                      <td className="text-capitalize">{order.payment_method?.replace('_', ' ')}</td>
                      <td>{order.items?.length || 0} item(s)</td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                        >
                          {expanded === order.id ? 'Hide' : 'Details'}
                        </button>
                      </td>
                    </tr>
                    {expanded === order.id && (
                      <tr key={`${order.id}-detail`}>
                        <td colSpan={7} className="bg-light">
                          <div className="p-3">
                            <div className="row mb-3">
                              <div className="col-md-6">
                                <strong>Shipping Address:</strong> {order.shipping_address}
                              </div>
                              {order.notes && (
                                <div className="col-md-6">
                                  <strong>Notes:</strong> {order.notes}
                                </div>
                              )}
                            </div>
                            <table className="table table-sm mb-0">
                              <thead>
                                <tr>
                                  <th>Product</th>
                                  <th>Price</th>
                                  <th>Qty</th>
                                  <th>Subtotal</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(order.items || []).map(item => (
                                  <tr key={item.id}>
                                    <td>{item.product?.name || `Product #${item.product_id}`}</td>
                                    <td>${parseFloat(item.price).toFixed(2)}</td>
                                    <td>{item.quantity}</td>
                                    <td>${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </>
  )
}
