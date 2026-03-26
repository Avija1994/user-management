import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RegisterPage() {
  const [form, setForm]       = useState({ name: '', email: '', password: '', password_confirmation: '' })
  const [loading, setLoading] = useState(false)
  const { register }          = useAuth()
  const navigate              = useNavigate()

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.password_confirmation) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation)
      toast.success('Account created! Welcome to Fruitables.')
      navigate('/')
    } catch (err) {
      const errors = err.response?.data?.errors
      if (errors) {
        Object.values(errors).forEach(msgs => msgs.forEach(m => toast.error(m)))
      } else {
        toast.error(err.response?.data?.message || 'Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Register</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Register</li>
        </ol>
      </div>

      <div className="container py-5 my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow border-0 rounded-3">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fa fa-leaf fa-3x text-primary"></i>
                  <h3 className="mt-2 fw-bold">Create Account</h3>
                  <p className="text-muted small">Join Fruitables today</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-user"></i></span>
                      <input
                        name="name" required value={form.name} onChange={handleChange}
                        className="form-control py-3" placeholder="Your Full Name"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-envelope"></i></span>
                      <input
                        name="email" type="email" required value={form.email} onChange={handleChange}
                        className="form-control py-3" placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-lock"></i></span>
                      <input
                        name="password" type="password" required value={form.password} onChange={handleChange}
                        className="form-control py-3" placeholder="Min 8 characters"
                        minLength={8}
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-lock"></i></span>
                      <input
                        name="password_confirmation" type="password" required value={form.password_confirmation} onChange={handleChange}
                        className="form-control py-3" placeholder="Repeat password"
                        minLength={8}
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating Account...</> : 'Create Account'}
                  </button>
                </form>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary fw-bold">Sign In</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
