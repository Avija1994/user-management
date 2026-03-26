import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { productService } from '../services/productService'
import ProductCard from '../components/ProductCard'
import Spinner from '../components/Spinner'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts]       = useState([])
  const [categories, setCategories]   = useState([])
  const [meta, setMeta]               = useState(null)
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState(searchParams.get('search') || '')
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '')
  const [sort, setSort]               = useState(searchParams.get('sort') || 'name')
  const [page, setPage]               = useState(1)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, per_page: 12 }
      if (search) params.search = search
      if (activeCategory) params.category = activeCategory
      if (sort) params.sort = sort
      const res = await productService.getAll(params)
      setProducts(res.data.data || res.data)
      setMeta(res.data.meta || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [page, search, activeCategory, sort])

  useEffect(() => {
    import('../services/api').then(({ default: api }) => {
      api.get('/categories').then(r => setCategories(r.data.data || r.data))
    })
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  const handleSearch = e => {
    e.preventDefault()
    setPage(1)
    fetchProducts()
  }

  const handleCategory = cat => {
    setActiveCategory(cat === activeCategory ? '' : cat)
    setPage(1)
  }

  const handleSort = e => {
    setSort(e.target.value)
    setPage(1)
  }

  return (
    <>
      <Navbar />

      {/* Page Header */}
      <div className="container-fluid page-header py-5">
        <h1 className="text-center text-white display-6">Shop</h1>
        <ol className="breadcrumb justify-content-center mb-0">
          <li className="breadcrumb-item"><a href="/" className="text-white">Home</a></li>
          <li className="breadcrumb-item text-white active">Shop</li>
        </ol>
      </div>

      <div className="container-fluid py-5">
        <div className="container py-5">
          <div className="row g-4">
            {/* Sidebar */}
            <div className="col-lg-3 col-xl-3">
              {/* Search */}
              <form onSubmit={handleSearch} className="mb-4">
                <div className="input-group">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    className="form-control"
                    placeholder="Search..."
                  />
                  <button type="submit" className="btn btn-primary"><i className="fa fa-search"></i></button>
                </div>
              </form>

              {/* Category Filter */}
              <div className="mb-4 bg-light rounded p-4">
                <h5 className="mb-3">Categories</h5>
                <div>
                  <div
                    className={`d-flex justify-content-between align-items-center mb-2 cursor-pointer ${!activeCategory ? 'text-primary fw-bold' : ''}`}
                    onClick={() => handleCategory('')}
                    style={{ cursor: 'pointer' }}
                  >
                    <span>All Products</span>
                  </div>
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className={`d-flex justify-content-between align-items-center mb-2 ${activeCategory === cat.slug ? 'text-primary fw-bold' : ''}`}
                      onClick={() => handleCategory(cat.slug)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span><i className="fa fa-arrow-right text-primary me-2"></i>{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price / Sort */}
              <div className="mb-4 bg-light rounded p-4">
                <h5 className="mb-3">Sort By</h5>
                <select className="form-select" value={sort} onChange={handleSort}>
                  <option value="name">Name A–Z</option>
                  <option value="-name">Name Z–A</option>
                  <option value="price">Price: Low to High</option>
                  <option value="-price">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-lg-9 col-xl-9">
              {loading ? (
                <Spinner />
              ) : products.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">No products found</h4>
                </div>
              ) : (
                <>
                  <div className="row g-4">
                    {products.map(product => (
                      <div className="col-md-6 col-xl-4" key={product.id}>
                        <ProductCard product={product} />
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {meta && meta.last_page > 1 && (
                    <nav className="mt-4">
                      <ul className="pagination justify-content-center">
                        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setPage(p => p - 1)}>Previous</button>
                        </li>
                        {Array.from({ length: meta.last_page }, (_, i) => i + 1).map(p => (
                          <li key={p} className={`page-item ${p === page ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                          </li>
                        ))}
                        <li className={`page-item ${page === meta.last_page ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setPage(p => p + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
