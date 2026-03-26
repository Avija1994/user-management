import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function LoginPage() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()
  const location              = useLocation()
  const from                  = location.state?.from?.pathname || '/'

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate(from, { replace: true })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Login</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><Link to="/" className="text-white">Home</Link></li>
          <li className="breadcrumb-item text-white active">Login</li>
        </ol>
      </div>

      <div className="container py-5 my-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card shadow border-0 rounded-3">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <i className="fa fa-leaf fa-3x text-primary"></i>
                  <h3 className="mt-2 fw-bold">Sign In</h3>
                  <p className="text-muted small">Welcome back to Fruitables</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-envelope"></i></span>
                      <input
                        name="email" type="email" required
                        value={form.email} onChange={handleChange}
                        className="form-control py-3" placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <span className="input-group-text bg-primary text-white"><i className="fa fa-lock"></i></span>
                      <input
                        name="password" type="password" required
                        value={form.password} onChange={handleChange}
                        className="form-control py-3" placeholder="Your password"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary w-100 rounded-pill py-3 mb-3"
                    disabled={loading}
                  >
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Signing In...</> : 'Sign In'}
                  </button>
                </form>

                <div className="text-center">
                  <p className="mb-0 text-muted">
                    Don&apos;t have an account?{' '}
                    <Link to="/register" className="text-primary fw-bold">Create Account</Link>
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
