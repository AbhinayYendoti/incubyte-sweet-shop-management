import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (name, email, password) =>
    api.post('/auth/register', { name, email, password })
}

export const sweetsApi = {
  getAll: () => api.get('/sweets'),
  getById: (id) => api.get(`/sweets/${id}`),
  create: (sweet) => api.post('/sweets', sweet),
  update: (id, sweet) => api.put(`/sweets/${id}`, sweet),
  delete: (id) => api.delete(`/sweets/${id}`),
  purchase: (id, quantity) =>
    api.post(`/sweets/${id}/purchase`, { quantity }),
  restock: (id, quantity) =>
    api.post(`/sweets/${id}/restock`, { quantity })
}

export default api

