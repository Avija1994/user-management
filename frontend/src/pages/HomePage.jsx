import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { productService } from '../services/productService'
import { testimonialService } from '../services/testimonialService'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

/* ── static products shown in the vegatables row ── */
const vegItems = [
  { img: '/img/vegetable-item-6.jpg', name: 'Parsely',     price: 4.99 },
  { img: '/img/vegetable-item-1.jpg', name: 'Carrot',      price: 3.99 },
  { img: '/img/vegetable-item-3.png', name: 'Broccoli',    price: 7.99 },
  { img: '/img/vegetable-item-4.jpg', name: 'Bell Pepper', price: 7.99 },
  { img: '/img/vegetable-item-5.jpg', name: 'Potatoes',    price: 7.99 },
  { img: '/img/vegetable-item-2.jpg', name: 'Spinach',     price: 4.99 },
]

const bestItems = [
  { img: '/img/best-product-1.jpg', name: 'Organic Tomato', price: 3.12 },
  { img: '/img/best-product-2.jpg', name: 'Organic Onion',  price: 2.50 },
  { img: '/img/best-product-3.jpg', name: 'Organic Garlic', price: 4.00 },
  { img: '/img/best-product-4.jpg', name: 'Sweet Potato',   price: 5.12 },
  { img: '/img/best-product-5.jpg', name: 'Cherry Tomato',  price: 6.50 },
  { img: '/img/best-product-6.jpg', name: 'Purple Onion',   price: 3.99 },
]

const TABS = ['All Products', 'Vegetables', 'Fruits', 'Bread', 'Meat']

export default function HomePage() {
  const [products, setProducts]             = useState([])
  const [testimonials, setTestimonials]     = useState([])
  const [loading, setLoading]               = useState(true)
  const [activeTab, setActiveTab]           = useState('All Products')
  const { addItem }                         = useCart()
  const { isAuthenticated }                 = useAuth()

  useEffect(() => {
    Promise.all([
      productService.getAll({ per_page: 50 }),
      testimonialService.getAll(),
    ])
      .then(([prodRes, testRes]) => {
        setProducts(prodRes.data.data || prodRes.data)
        setTestimonials(testRes.data.data || testRes.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = activeTab === 'All Products'
    ? products
    : products.filter(p =>
        p.category?.name?.toLowerCase() === activeTab.toLowerCase()
      )

  const handleAddToCart = async (productId, productName) => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart')
      return
    }
    try {
      await addItem(productId)
      toast.success(`${productName} added to cart!`)
    } catch {
      toast.error('Failed to add to cart')
    }
  }

  return (
    <>
      <Navbar />

      {/* ── Hero Start ── */}
      <div className="container-fluid mb-5 hero-header">
        <div className="container pb-5">
          <div className="row g-5 align-items-center">
            <div className="col-md-12 col-lg-7">
              <h4 className="mb-3 text-secondary">100% Organic Foods</h4>
              <h1 className="mb-5 display-3 text-primary">Organic Veggies &amp; Fruits Foods</h1>
              <div className="position-relative mx-auto">
                <input
                  className="form-control border-2 border-secondary w-75 py-3 px-4 rounded-pill"
                  type="text"
                  placeholder="Search products..."
                />
                <Link
                  to="/shop"
                  className="btn btn-primary border-2 border-secondary py-3 px-4 position-absolute rounded-pill text-white h-100"
                  style={{ top: 0, right: '25%' }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="col-md-12 col-lg-5">
              <div
                id="carouselId"
                className="carousel slide position-relative"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner" role="listbox">
                  <div className="carousel-item active rounded">
                    <img
                      src="/img/hero-img-1.png"
                      className="img-fluid w-100 rounded"
                      alt="Fresh Fruits"
                    />
                    <Link to="/shop" className="btn px-4 py-2 text-white rounded">
                      Fruits
                    </Link>
                  </div>
                  <div className="carousel-item rounded">
                    <img
                      src="/img/hero-img-2.jpg"
                      className="img-fluid w-100 rounded"
                      alt="Fresh Vegetables"
                    />
                    <Link to="/shop" className="btn px-4 py-2 text-white rounded">
                      Vegetables
                    </Link>
                  </div>
                </div>
                <button
                  className="carousel-control-prev"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="prev"
                >
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button
                  className="carousel-control-next"
                  type="button"
                  data-bs-target="#carouselId"
                  data-bs-slide="next"
                >
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ── Hero End ── */}


      {/* ── Featurs Section Start ── */}
      <div className="container-fluid featurs py-5">
        <div className="container py-5">
          <div className="row g-4">
            {[
              { icon: 'fas fa-car-side',    title: 'Free Shipping',    desc: 'Free on order over $300' },
              { icon: 'fas fa-user-shield', title: 'Security Payment', desc: '100% security payment'  },
              { icon: 'fas fa-exchange-alt',title: '30 Day Return',    desc: '30 day money guarantee' },
              { icon: 'fa fa-phone-alt',    title: '24/7 Support',     desc: 'Support every time fast' },
            ].map((f, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <div className="featurs-item text-center rounded bg-light p-4">
                  <div className="featurs-icon btn-square rounded-circle bg-secondary mb-5 mx-auto">
                    <i className={`${f.icon} fa-3x text-white`}></i>
                  </div>
                  <div className="featurs-content text-center">
                    <h5>{f.title}</h5>
                    <p className="mb-0">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Featurs Section End ── */}


      {/* ── Fruits Shop Start ── */}
      <div className="container-fluid fruite py-5">
        <div className="container py-5">
          <div className="tab-class text-center">
            <div className="row g-4">
              <div className="col-lg-4 text-start">
                <h1>Our Organic Products</h1>
              </div>
              <div className="col-lg-8 text-end">
                <ul className="nav nav-pills d-inline-flex text-center mb-5">
                  {TABS.map(tab => (
                    <li className="nav-item" key={tab}>
                      <button
                        className={`d-flex m-2 py-2 bg-light rounded-pill border-0 ${activeTab === tab ? 'active' : ''}`}
                        style={{ minWidth: 130, justifyContent: 'center' }}
                        onClick={() => setActiveTab(tab)}
                      >
                        <span className={activeTab === tab ? 'text-white' : 'text-dark'}>
                          {tab}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {loading ? (
              <Spinner />
            ) : (
              <div className="tab-content">
                <div className="tab-pane fade show p-0 active">
                  <div className="row g-4">
                    <div className="col-lg-12">
                      <div className="row g-4">
                        {(filteredProducts.length > 0 ? filteredProducts : products).slice(0, 8).map((product) => {
                          const imgSrc = product.image_url || `/img/fruite-item-${(product.id % 6) + 1}.jpg`
                          return (
                            <div className="col-md-6 col-lg-4 col-xl-3" key={product.id}>
                              <div className="rounded position-relative fruite-item">
                                <div className="fruite-img">
                                  <Link to={`/shop/${product.slug}`}>
                                    <img
                                      src={imgSrc}
                                      className="img-fluid w-100 rounded-top"
                                      alt={product.name}
                                      style={{ height: 220, objectFit: 'cover' }}
                                      onError={e => { e.target.src = `/img/fruite-item-1.jpg` }}
                                    />
                                  </Link>
                                </div>
                                <div
                                  className="text-white bg-secondary px-3 py-1 rounded position-absolute"
                                  style={{ top: 10, left: 10 }}
                                >
                                  {product.category?.name}
                                </div>
                                <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                  <Link to={`/shop/${product.slug}`} className="text-decoration-none text-dark">
                                    <h4>{product.name}</h4>
                                  </Link>
                                  <p className="text-muted small" style={{ overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                                    {product.description}
                                  </p>
                                  <div className="d-flex justify-content-between flex-lg-wrap">
                                    <p className="text-dark fs-5 fw-bold mb-0">
                                      ${parseFloat(product.price).toFixed(2)} / {product.unit}
                                    </p>
                                    <button
                                      onClick={() => handleAddToCart(product.id, product.name)}
                                      className="btn border border-secondary rounded-pill px-3 text-primary"
                                    >
                                      <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* ── Fruits Shop End ── */}


      {/* ── Promo Banners Start ── */}
      <div className="container-fluid service py-5">
        <div className="container py-5">
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4">
              <Link to="/shop">
                <div className="service-item bg-secondary rounded border border-secondary">
                  <img src="/img/featur-1.jpg" className="img-fluid rounded-top w-100" alt="Fresh Apples" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-primary text-center p-4 rounded">
                      <h5 className="text-white">Fresh Apples</h5>
                      <h3 className="mb-0">20% OFF</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/shop">
                <div className="service-item bg-dark rounded border border-dark">
                  <img src="/img/featur-2.jpg" className="img-fluid rounded-top w-100" alt="Tasty Fruits" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-light text-center p-4 rounded">
                      <h5 className="text-primary">Tasty Fruits</h5>
                      <h3 className="mb-0">Free delivery</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-md-6 col-lg-4">
              <Link to="/shop">
                <div className="service-item bg-primary rounded border border-primary">
                  <img src="/img/featur-3.jpg" className="img-fluid rounded-top w-100" alt="Exotic Vegetables" />
                  <div className="px-4 rounded-bottom">
                    <div className="service-content bg-secondary text-center p-4 rounded">
                      <h5 className="text-white">Exotic Vegetables</h5>
                      <h3 className="mb-0">Discount 30%</h3>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* ── Promo Banners End ── */}


      {/* ── Vegetables Section Start ── */}
      <div className="container-fluid vesitable py-5">
        <div className="container py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="mb-0">Fresh Organic Vegetables</h1>
            <Link to="/shop?category=vegetables" className="btn btn-primary rounded-pill px-4">
              View All
            </Link>
          </div>
          <div className="row g-4">
            {vegItems.map((v, i) => (
              <div className="col-md-6 col-lg-4 col-xl-2" key={i}>
                <div className="border border-primary rounded position-relative vesitable-item h-100">
                  <div className="vesitable-img" style={{ overflow: 'hidden', borderRadius: '10px 10px 0 0' }}>
                    <img
                      src={v.img}
                      className="img-fluid w-100 rounded-top"
                      alt={v.name}
                      style={{ height: 160, objectFit: 'cover' }}
                    />
                  </div>
                  <div
                    className="text-white bg-primary px-3 py-1 rounded position-absolute"
                    style={{ top: 10, right: 10 }}
                  >
                    Vegetable
                  </div>
                  <div className="p-3 rounded-bottom">
                    <h6>{v.name}</h6>
                    <div className="d-flex justify-content-between align-items-center flex-wrap">
                      <p className="text-dark fw-bold mb-0">${v.price.toFixed(2)} / kg</p>
                      <Link to="/shop" className="btn border border-secondary rounded-pill px-2 py-1 text-primary small">
                        <i className="fa fa-shopping-bag me-1 text-primary"></i> Add
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Vegetables Section End ── */}


        
        {/* Banner Section Start */}
        <div className="container-fluid banner bg-secondary my-5">
            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="py-4">
                            <h1 className="display-3 text-white">Fresh Exotic Fruits</h1>
                            <p className="fw-normal display-3 text-dark mb-4">in Our Store</p>
                            <p className="mb-4 text-dark">The generated Lorem Ipsum is therefore always free from repetition injected humour, or non-characteristic words etc.</p>
                            <a href="#" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5">BUY</a>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <img src="img/baner-1.png" className="img-fluid w-100 rounded" alt="" />
                            <div className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute" style={{width: 140, height: 140, top: 0, left: 0}}>
                                <h1 style={{fontSize: 100}}>1</h1>
                                <div className="d-flex flex-column">
                                    <span className="h2 mb-0">50$</span>
                                    <span className="h4 text-muted mb-0">kg</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* Banner Section End */}






      {/* ── Best Seller Start ── */}
      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h4 className="text-primary">Our Best Seller</h4>
            <h1 className="display-5">Popular Products</h1>
          </div>
          <div className="row g-4">
            {bestItems.map((b, i) => (
              <div className="col-lg-6 col-xl-4" key={i}>
                <div className="p-4 rounded bg-light">
                  <div className="row align-items-center">
                    <div className="col-6">
                      <img
                        src={b.img}
                        className="img-fluid rounded-circle w-100"
                        alt={b.name}
                        style={{ height: 120, objectFit: 'cover' }}
                      />
                    </div>
                    <div className="col-6">
                      <Link to="/shop" className="h5 text-dark text-decoration-none">{b.name}</Link>
                      <div className="d-flex my-3">
                        {[...Array(4)].map((_, si) => (
                          <i key={si} className="fas fa-star text-primary me-1"></i>
                        ))}
                        <i className="fas fa-star text-muted"></i>
                      </div>
                      <h4 className="mb-3">${b.price.toFixed(2)}</h4>
                      <Link to="/shop" className="btn border border-secondary rounded-pill px-3 text-primary small">
                        <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ── Best Seller End ── */}


      {/* ── Facts Start ── */}
      <div className="container-fluid py-5">
        <div className="container">
          <div className="bg-light p-5 rounded">
            <div className="row g-4 justify-content-center">
              {[
                { icon: 'fa-users', label: 'satisfied customers', value: '1963' },
                { icon: 'fa-star',  label: 'quality of service',  value: '99%'  },
                { icon: 'fa-check', label: 'quality certificates', value: '33'  },
                { icon: 'fa-box',   label: 'Available Products',  value: '789'  },
              ].map((f, i) => (
                <div className="col-md-6 col-lg-6 col-xl-3" key={i}>
                  <div className="counter bg-white rounded p-5 text-center">
                    <i className={`fa ${f.icon} fa-3x text-secondary mb-3`}></i>
                    <h4 className="text-primary text-uppercase">{f.label}</h4>
                    <h1>{f.value}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* ── Facts End ── */}


      {/* ── Testimonials Start ── */}
      <div className="container-fluid testimonial py-5">
        <div className="container py-5">
          <div className="testimonial-header text-center">
            <h4 className="text-primary">Our Testimonial</h4>
            <h1 className="display-5 mb-5 text-dark">Our Client Saying!</h1>
          </div>
          <div className="row g-4">
            {testimonials.length > 0
              ? testimonials.slice(0, 3).map(t => (
                  <div className="col-md-6 col-lg-4" key={t.id}>
                    <div className="testimonial-item bg-light rounded p-4">
                      <div className="position-relative">
                        <i
                          className="fa fa-quote-right fa-2x text-secondary position-absolute"
                          style={{ bottom: 30, right: 0 }}
                        ></i>
                        <div className="mb-4 pb-4 border-bottom border-secondary">
                          <p className="mb-0">{t.message}</p>
                        </div>
                        <div className="d-flex align-items-center flex-nowrap">
                          <div className="bg-secondary rounded">
                            <img
                              src={t.image || '/img/testimonial-1.jpg'}
                              className="img-fluid rounded"
                              style={{ width: 100, height: 100, objectFit: 'cover' }}
                              alt={t.name}
                              onError={e => { e.target.src = '/img/testimonial-1.jpg' }}
                            />
                          </div>
                          <div className="ms-4 d-block">
                            <h4 className="text-dark">{t.name}</h4>
                            <p className="m-0 pb-3">{t.profession || 'Customer'}</p>
                            <div className="d-flex pe-5">
                              {[...Array(5)].map((_, si) => (
                                <i
                                  key={si}
                                  className={`fas fa-star me-1 ${si < (t.rating || 5) ? 'text-primary' : 'text-muted'}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              : /* Placeholder while loading */ [1, 2, 3].map(n => (
                  <div className="col-md-6 col-lg-4" key={n}>
                    <div className="testimonial-item bg-light rounded p-4">
                      <div className="position-relative">
                        <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{ bottom: 30, right: 0 }}></i>
                        <div className="mb-4 pb-4 border-bottom border-secondary">
                          <p className="mb-0">Lorem Ipsum is simply dummy text of the printing industry&apos;s standard dummy text ever since the 1500s.</p>
                        </div>
                        <div className="d-flex align-items-center flex-nowrap">
                          <div className="bg-secondary rounded">
                            <img src="/img/testimonial-1.jpg" className="img-fluid rounded" style={{ width: 100, height: 100 }} alt="client" />
                          </div>
                          <div className="ms-4 d-block">
                            <h4 className="text-dark">Client Name</h4>
                            <p className="m-0 pb-3">Profession</p>
                            <div className="d-flex pe-5">
                              {[...Array(5)].map((_, si) => <i key={si} className="fas fa-star text-primary me-1"></i>)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            }
          </div>
        </div>
      </div>
      {/* ── Testimonials End ── */}

      <Footer />
    </>
  )
}
