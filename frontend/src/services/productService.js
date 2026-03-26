import api from './api'

export const getProducts = (params = {}) => api.get('/products', { params })

export const getProductBySlug = (slug) => api.get(`/products/${slug}`)

export const getCategories = () => api.get('/categories')

export const productService = {
  getAll: (params = {}) => api.get('/products', { params }),
  getBySlug: (slug) => api.get(`/products/${slug}`),
}
