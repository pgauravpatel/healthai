import axios from 'axios'

/**
 * Axios instance with base configuration
 */
const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong'
    
    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401) {
      // Clear any stored auth state if needed
      window.dispatchEvent(new CustomEvent('auth:logout'))
    }
    
    return Promise.reject({ message, ...error.response?.data })
  }
)

/**
 * Auth API endpoints
 */
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/password', data),
  toggleBookmark: (blogId) => api.post(`/auth/bookmark/${blogId}`),
  getBookmarks: () => api.get('/auth/bookmarks')
}

/**
 * Chat API endpoints
 */
export const chatAPI = {
  sendMessage: (data) => api.post('/chat', data),
  getChats: () => api.get('/chat'),
  getChat: (id) => api.get(`/chat/${id}`),
  createNewChat: () => api.post('/chat/new'),
  deleteChat: (id) => api.delete(`/chat/${id}`),
  clearAllChats: () => api.delete('/chat/clear')
}

/**
 * Blog API endpoints
 */
export const blogAPI = {
  getBlogs: (params) => api.get('/blogs', { params }),
  getBlog: (slug) => api.get(`/blogs/${slug}`),
  getCategories: () => api.get('/blogs/categories'),
  getTags: () => api.get('/blogs/tags'),
  toggleLike: (id) => api.post(`/blogs/${id}/like`),
  getRelatedBlogs: (id) => api.get(`/blogs/${id}/related`),
  
  // Admin endpoints
  getAdminBlogs: (params) => api.get('/blogs/admin/all', { params }),
  getAdminBlog: (id) => api.get(`/blogs/admin/${id}`),
  createBlog: (data) => api.post('/blogs/admin', data),
  updateBlog: (id, data) => api.put(`/blogs/admin/${id}`, data),
  deleteBlog: (id) => api.delete(`/blogs/admin/${id}`),
  togglePublish: (id) => api.patch(`/blogs/admin/${id}/publish`)
}

/**
 * Comment API endpoints
 */
export const commentAPI = {
  getComments: (blogId, params) => api.get(`/comments/${blogId}`, { params }),
  createComment: (blogId, data) => api.post(`/comments/${blogId}`, data),
  updateComment: (id, data) => api.put(`/comments/${id}`, data),
  deleteComment: (id) => api.delete(`/comments/${id}`),
  toggleLike: (id) => api.post(`/comments/${id}/like`)
}

export default api

