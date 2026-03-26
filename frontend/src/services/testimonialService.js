import api from './api'

export const getTestimonials = () => api.get('/testimonials')

export const testimonialService = {
  getAll: () => api.get('/testimonials'),
}
