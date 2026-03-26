import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function NotFoundPage() {
  return (
    <>
      <Navbar />
      <div className="container-fluid py-5 bg-light" style={{ minHeight: '70vh' }}>
        <div className="container py-5 text-center">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div style={{ fontSize: '8rem', lineHeight: 1, color: '#81c408', fontWeight: 700 }}>
                404
              </div>
              <h2 className="mb-3">Oops! Page Not Found</h2>
              <p className="text-muted mb-4">
                Sorry, the page you are looking for doesn&apos;t exist or has been moved.
              </p>
              <div className="d-flex gap-3 justify-content-center">
                <Link to="/" className="btn btn-primary rounded-pill py-3 px-5">
                  <i className="fa fa-home me-2"></i>Go Home
                </Link>
                <Link to="/shop" className="btn btn-outline-dark rounded-pill py-3 px-5">
                  <i className="fa fa-shopping-bag me-2"></i>Shop Now
                </Link>
              </div>
              <div className="mt-5">
                <img
                  src="https://placehold.co/300x200?text=404+Not+Found"
                  className="img-fluid rounded"
                  alt="404"
                  style={{ maxWidth: 300, opacity: 0.6 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
