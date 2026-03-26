import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { contactService } from '../services/contactService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const initialForm = { name: '', email: '', subject: '', message: '' }

export default function ContactPage() {
  const [form, setForm]       = useState(initialForm)
  const [loading, setLoading] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await contactService.send(form)
      toast.success('Your message has been sent! We will get back to you soon.')
      setForm(initialForm)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Contact Us</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Contact</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row g-5">
            {/* Contact Info */}
            <div className="col-lg-4">
              <h4 className="mb-4">Get In Touch</h4>
              <p className="text-muted mb-4">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
              {[
                { icon: 'fa-map-marker-alt', title: 'Our Store', text: '123 Street, New York, USA' },
                { icon: 'fa-phone-alt', title: 'Call Us', text: '+012 345 67890' },
                { icon: 'fa-envelope', title: 'Email Us', text: 'info@fruitables.com' },
                { icon: 'fa-clock', title: 'Opening Hours', text: 'Mon–Fri: 09:00 – 20:00' },
              ].map((info, i) => (
                <div className="d-flex mb-4" key={i}>
                  <div
                    className="btn-square bg-primary rounded me-3 flex-shrink-0"
                    style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <i className={`fa ${info.icon} text-white`}></i>
                  </div>
                  <div>
                    <h6 className="mb-0">{info.title}</h6>
                    <p className="mb-0 text-muted small">{info.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact Form */}
            <div className="col-lg-8">
              <h4 className="mb-4">Send Us A Message</h4>
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Your Name *</label>
                    <input
                      name="name" required value={form.name} onChange={handleChange}
                      className="form-control py-3" placeholder="Your Name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Your Email *</label>
                    <input
                      name="email" type="email" required value={form.email} onChange={handleChange}
                      className="form-control py-3" placeholder="Your Email"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Subject</label>
                    <input
                      name="subject" value={form.subject} onChange={handleChange}
                      className="form-control py-3" placeholder="Subject"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Message *</label>
                    <textarea
                      name="message" required rows={6} value={form.message} onChange={handleChange}
                      className="form-control" placeholder="Your Message"
                    />
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary rounded-pill py-3 px-5"
                      disabled={loading}
                    >
                      {loading
                        ? <><span className="spinner-border spinner-border-sm me-2"></span>Sending...</>
                        : <><i className="fa fa-paper-plane me-2"></i>Send Message</>
                      }
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-5 rounded overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.186!2d-74.006!3d40.7128!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNew York!5e0!3m2!1sen!2sus!4v0"
              style={{ border: 0, width: '100%', height: 350 }}
              allowFullScreen
              loading="lazy"
              title="Store Location"
            ></iframe>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
