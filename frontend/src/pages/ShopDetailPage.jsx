import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { productService } from '../services/productService'
import { useCart } from '../context/CartContext'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ShopDetailPage() {
  const { slug } = useParams()
  const [product, setProduct]   = useState(null)
  const [related, setRelated]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [qty, setQty]           = useState(1)
  const { addItem }             = useCart()

  useEffect(() => {
    setLoading(true)
    productService.getBySlug(slug)
      .then(res => {
        const prod = res.data.data || res.data
        setProduct(prod)
        return productService.getAll({ category: prod.category?.name, per_page: 4 })
      })
      .then(res => {
        const items = (res.data.data || res.data).filter(p => p.slug !== slug)
        setRelated(items.slice(0, 4))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [slug])

  const handleAddToCart = async () => {
    try {
      await addItem(product.id, qty)
      toast.success(`${product.name} added to cart!`)
    } catch {
      toast.error('Failed to add to cart.')
    }
  }

  if (loading) return <><Navbar /><Spinner /><Footer /></>
  if (!product) return <><Navbar /><div className="container py-5"><h3>Product not found</h3></div><Footer /></>

  const imgUrl = product.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop Detail</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/shop" className="text-white">Shop</Link></li>
          <li className="breadcrumb-item text-white active">{product.name}</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row g-5">
            {/* Image */}
            <div className="col-lg-6">
              <img src={imgUrl} className="img-fluid rounded w-100" style={{ maxHeight: 450, objectFit: 'contain' }} alt={product.name} />
            </div>
            {/* Details */}
            <div className="col-lg-6">
              {product.category && (
                <small className="badge bg-primary text-white rounded-pill mb-2">{product.category.name}</small>
              )}
              <h1 className="fw-bold">{product.name}</h1>
              <div className="d-flex align-items-center mb-3">
                <i className="fa fa-star text-secondary me-1"></i>
                <i className="fa fa-star text-secondary me-1"></i>
                <i className="fa fa-star text-secondary me-1"></i>
                <i className="fa fa-star text-secondary me-1"></i>
                <i className="fa fa-star-half-alt text-secondary me-2"></i>
                <small className="text-muted">(123 Reviews)</small>
              </div>
              <h4 className="text-primary mb-3">${parseFloat(product.price).toFixed(2)}</h4>
              <p className="mb-4">{product.description}</p>

              {/* Stock */}
              <p className={`mb-3 ${product.stock > 0 ? 'text-success' : 'text-danger'}`}>
                <i className={`fa ${product.stock > 0 ? 'fa-check' : 'fa-times'} me-2`}></i>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
              </p>

              {/* Quantity + Add */}
              {product.stock > 0 && (
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <div className="input-group" style={{ width: 120 }}>
                    <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
                    <input type="number" className="form-control text-center" value={qty} readOnly />
                    <button className="btn btn-outline-secondary" onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
                  </div>
                  <button className="btn btn-primary py-2 px-4" onClick={handleAddToCart}>
                    <i className="fa fa-shopping-cart me-2"></i> Add to Cart
                  </button>
                </div>
              )}

              <hr />
              <table className="table table-borderless mb-0">
                <tbody>
                  <tr><th scope="row" style={{ width: 150 }}>Category</th><td>{product.category?.name || '—'}</td></tr>
                  <tr><th scope="row">SKU</th><td>{product.slug}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-5">
              <h4 className="mb-4">Related Products</h4>
              <div className="row g-4">
                {related.map(p => {
                  const pImg = p.image_url || `https://placehold.co/300x200?text=${encodeURIComponent(p.name)}`
                  return (
                    <div className="col-6 col-md-4 col-lg-3" key={p.id}>
                      <div className="card border-0 shadow-sm h-100">
                        <img src={pImg} className="card-img-top" style={{ height: 150, objectFit: 'cover' }} alt={p.name} />
                        <div className="card-body text-center">
                          <h6 className="mb-1">{p.name}</h6>
                          <p className="text-primary mb-2">${parseFloat(p.price).toFixed(2)}</p>
                          <Link to={`/shop/${p.slug}`} className="btn btn-sm btn-outline-primary">View</Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
