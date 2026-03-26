import api from './api'

export const submitContact = (payload) => api.post('/contact', payload)

export const contactService = {
  send: (payload) => api.post('/contact', payload),
}
