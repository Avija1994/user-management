import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testimonialService } from '../services/testimonialService'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    testimonialService.getAll()
      .then(res => setTestimonials(res.data.data || res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Testimonials</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Testimonials</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <small className="text-uppercase text-primary fw-bold">Our Clients</small>
            <h1>What Our Clients Say!</h1>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <div className="row g-4">
              {testimonials.map(t => (
                <div className="col-md-6 col-xl-4" key={t.id}>
                  <div className="testimonial-item bg-light rounded p-4 h-100 shadow-sm">
                    <div className="d-flex mb-3">
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fa fa-star ${i < (t.rating || 5) ? 'text-secondary' : 'text-muted'} me-1`}></i>
                      ))}
                    </div>
                    <p className="mb-4 fst-italic">"{t.message}"</p>
                    <div className="d-flex align-items-center">
                      <img
                        src={t.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=81c408&color=fff`}
                        className="rounded-circle me-3"
                        style={{ width: 56, height: 56, objectFit: 'cover' }}
                        alt={t.name}
                      />
                      <div>
                        <h6 className="mb-0 fw-bold">{t.name}</h6>
                        <small className="text-primary">{t.profession || t.role || 'Customer'}</small>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
