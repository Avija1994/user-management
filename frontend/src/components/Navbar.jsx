import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState }                   from 'react'
import { useAuth }                    from '../context/AuthContext'
import { useCart }                    from '../context/CartContext'
import SearchModal                    from './SearchModal'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [showSearch, setShowSearch] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <>
      <div className="container-fluid fixed-top" style={{ zIndex: 1030 }}>
        {/* Top Bar */}
        <div className="container topbar bg-primary d-none d-lg-block">
          <div className="d-flex justify-content-between">
            <div className="top-info ps-2">
              <small className="me-3">
                <i className="fas fa-map-marker-alt me-2 text-secondary"></i>
                <a href="#" className="text-white">123 Street, New York</a>
              </small>
              <small className="me-3">
                <i className="fas fa-envelope me-2 text-secondary"></i>
                <a href="#" className="text-white">info@fruitables.com</a>
              </small>
            </div>
            <div className="top-link pe-2">
              <a href="#" className="text-white"><small className="text-white mx-2">Privacy Policy</small>/</a>
              <a href="#" className="text-white"><small className="text-white mx-2">Terms of Use</small>/</a>
              <a href="#" className="text-white"><small className="text-white ms-2">Sales and Refunds</small></a>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="container px-0">
          <nav className="navbar navbar-light bg-white navbar-expand-xl">
            <Link to="/" className="navbar-brand">
              <h1 className="text-primary display-6 mb-0">Fruitables</h1>
            </Link>
            <button
              className="navbar-toggler py-2 px-3"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarCollapse"
            >
              <span className="fa fa-bars text-primary"></span>
            </button>

            <div className="collapse navbar-collapse bg-white" id="navbarCollapse">
              <div className="navbar-nav mx-auto">
                <NavLink to="/" end className={({ isActive }) => `nav-item nav-link${isActive ? ' active' : ''}`}>Home</NavLink>
                <NavLink to="/shop" className={({ isActive }) => `nav-item nav-link${isActive ? ' active' : ''}`}>Shop</NavLink>
                {/* <NavLink to="/shop-detail" className={({ isActive }) => `nav-item nav-link${isActive ? ' active' : ''}`}>Shop Detail</NavLink> */}
                <div className="nav-item dropdown">
                  <a href="#" className="nav-link dropdown-toggle" data-bs-toggle="dropdown">Pages</a>
                  <div className="dropdown-menu m-0 bg-secondary rounded-0">
                    <Link to="/cart"         className="dropdown-item">Cart</Link>
                    <Link to="/checkout"     className="dropdown-item">Checkout</Link>
                    <Link to="/testimonials" className="dropdown-item">Testimonials</Link>
                    {isAuthenticated && <Link to="/orders" className="dropdown-item">My Orders</Link>}
                  </div>
                </div>
                <NavLink to="/contact" className={({ isActive }) => `nav-item nav-link${isActive ? ' active' : ''}`}>Contact</NavLink>
              </div>

              <div className="d-flex m-3 me-0 align-items-center">
                <button
                  className="btn-search btn border border-secondary btn-md-square rounded-circle bg-white me-4"
                  onClick={() => setShowSearch(true)}
                >
                  <i className="fas fa-search text-primary"></i>
                </button>

                <Link to="/cart" className="position-relative me-4 my-auto">
                  <i className="fa fa-shopping-bag fa-2x"></i>
                  {itemCount > 0 && (
                    <span
                      className="position-absolute bg-secondary rounded-circle d-flex align-items-center justify-content-center text-dark px-1"
                      style={{ top: '-5px', left: '15px', height: '20px', minWidth: '20px', fontSize: '12px' }}
                    >
                      {itemCount}
                    </span>
                  )}
                </Link>

                {isAuthenticated ? (
                  <div className="dropdown my-auto">
                    <a href="#" className="dropdown-toggle text-dark text-decoration-none" data-bs-toggle="dropdown">
                      <i className="fas fa-user fa-2x"></i>
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li><span className="dropdown-item-text fw-bold">{user?.name}</span></li>
                      <li><hr className="dropdown-divider" /></li>
                      <li><Link to="/orders" className="dropdown-item">My Orders</Link></li>
                      <li><button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button></li>
                    </ul>
                  </div>
                ) : (
                  <Link to="/login" className="my-auto">
                    <i className="fas fa-user fa-2x"></i>
                  </Link>
                )}
              </div>
            </div>
          </nav>
        </div>
      </div>

      <SearchModal show={showSearch} onClose={() => setShowSearch(false)} />
    </>
  )
}
