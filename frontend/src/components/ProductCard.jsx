import { Link }       from 'react-router-dom'
import { useCart }     from '../context/CartContext'
import { useAuth }     from '../context/AuthContext'
import { toast }       from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const FALLBACK_IMGS = [
  '/img/fruite-item-1.jpg', '/img/fruite-item-2.jpg', '/img/fruite-item-3.jpg',
  '/img/fruite-item-4.jpg', '/img/fruite-item-5.jpg', '/img/fruite-item-6.jpg',
]

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart')
      navigate('/login')
      return
    }
    try {
      await addItem(product.id)
      toast.success(`${product.name} added to cart!`)
    } catch (err) {
      toast.error('Failed to add to cart')
    }
  }

  const fallback = FALLBACK_IMGS[(product.id - 1) % FALLBACK_IMGS.length]
  const imageUrl = product.image_url || (product.image ? `${BASE_URL}/storage/${product.image}` : fallback)

  return (
    <div className="rounded position-relative fruite-item">
      <div className="fruite-img">
        <Link to={`/shop/${product.slug}`}>
          <img
            src={imageUrl}
            className="img-fluid w-100 rounded-top"
            alt={product.name}
            style={{ height: '220px', objectFit: 'cover' }}
            onError={e => { e.target.src = fallback }}
          />
        </Link>
      </div>
      <div
        className="text-white bg-secondary px-3 py-1 rounded position-absolute"
        style={{ top: '10px', left: '10px' }}
      >
        {product.category?.name}
      </div>
      <div className="p-4 border border-secondary border-top-0 rounded-bottom">
        <Link to={`/shop/${product.slug}`} className="text-decoration-none text-dark">
          <h4>{product.name}</h4>
        </Link>
        <p className="text-muted small mb-2" style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.description}
        </p>
        <div className="d-flex justify-content-between flex-lg-wrap align-items-center">
          <p className="text-dark fs-5 fw-bold mb-0">
            ${parseFloat(product.price).toFixed(2)} / {product.unit}
          </p>
          <button
            className="btn border border-secondary rounded-pill px-3 text-primary"
            onClick={handleAddToCart}
          >
            <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
          </button>
        </div>
      </div>
    </div>
  )
}
