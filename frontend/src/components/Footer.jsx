import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')

  const handleSubscribe = (e) => {
    e.preventDefault()
    setEmail('')
  }

  return (
    <>
      {/* Footer Start */}
      <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
        <div className="container py-5">
          {/* Subscribe row */}
          <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226,175,24,0.5)' }}>
            <div className="row g-4">
              <div className="col-lg-3">
                <Link to="/">
                  <h1 className="text-primary mb-0">Fruitables</h1>
                  <p className="text-secondary mb-0">Fresh products</p>
                </Link>
              </div>
              <div className="col-lg-6">
                <form className="position-relative mx-auto" onSubmit={handleSubscribe}>
                  <input
                    className="form-control border-0 w-100 py-3 px-4 rounded-pill"
                    type="email"
                    placeholder="Your Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white"
                    style={{ top: 0, right: 0 }}
                  >
                    Subscribe Now
                  </button>
                </form>
              </div>
              <div className="col-lg-3">
                <div className="d-flex justify-content-end pt-3">
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-twitter"></i></a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-facebook-f"></i></a>
                  <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href="#"><i className="fab fa-youtube"></i></a>
                  <a className="btn btn-outline-secondary btn-md-square rounded-circle"      href="#"><i className="fab fa-linkedin-in"></i></a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer columns */}
          <div className="row g-5">
            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Why People Like us!</h4>
                <p className="mb-4">
                  Typesetting, remaining essentially unchanged. It was popularised in the 1960s
                  with the release of Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <Link to="/shop" className="btn border-secondary py-2 px-4 rounded-pill text-primary">
                  Read More
                </Link>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Shop Info</h4>
                <Link className="btn-link" to="/contact">About Us</Link>
                <Link className="btn-link" to="/contact">Contact Us</Link>
                <a className="btn-link" href="#">Privacy Policy</a>
                <a className="btn-link" href="#">Terms &amp; Condition</a>
                <a className="btn-link" href="#">Return Policy</a>
                <a className="btn-link" href="#">FAQs &amp; Help</a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="d-flex flex-column text-start footer-item">
                <h4 className="text-light mb-3">Account</h4>
                <Link className="btn-link" to="/login">My Account</Link>
                <Link className="btn-link" to="/shop">Shop Details</Link>
                <Link className="btn-link" to="/cart">Shopping Cart</Link>
                <a className="btn-link" href="#">Wishlist</a>
                <Link className="btn-link" to="/orders">Order History</Link>
                <a className="btn-link" href="#">International Orders</a>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className="footer-item">
                <h4 className="text-light mb-3">Contact</h4>
                <p>Address: 123 Street, New York, USA</p>
                <p>Email: info@fruitables.com</p>
                <p>Phone: +012 345 67890</p>
                <p className="mb-2">Payment Accepted</p>
                <img src="/img/payment.png" className="img-fluid" alt="payment methods"
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Footer End */}

      {/* Copyright Start */}
      <div className="container-fluid copyright bg-dark py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <span className="text-light">
                <i className="fas fa-copyright text-light me-2"></i>
                <Link to="/" className="text-light">Fruitables</Link>, All rights reserved.
              </span>
            </div>
            <div className="col-md-6 my-auto text-center text-md-end text-white">
              Designed By{' '}
              <a className="border-bottom text-white" href="https://htmlcodex.com" target="_blank" rel="noopener noreferrer">HTML Codex</a>
              {' '}Distributed By{' '}
              <a className="border-bottom text-white" href="https://themewagon.com" target="_blank" rel="noopener noreferrer">ThemeWagon</a>
            </div>
          </div>
        </div>
      </div>
      {/* Copyright End */}

      {/* Back to top */}
      <a
        href="#"
        className="btn btn-primary border-3 border-primary rounded-circle back-to-top"
        onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
      >
        <i className="fa fa-arrow-up"></i>
      </a>
    </>
  )
}
