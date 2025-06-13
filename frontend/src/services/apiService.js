import axios from 'axios'
import { API_CONFIG } from '@/constants'

const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
})


apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)

    if (error.response) {

      throw new Error(`Ошибка сервера: ${error.response.status} - ${error.response.data.message || error.response.data.error}`)
    } else if (error.request) {

      throw new Error('Сервер не отвечает. Проверьте подключение к интернету.')
    } else {

      throw new Error(`Ошибка запроса: ${error.message}`)
    }
  }
)

export const apiService = {

  async getPosts() {
    try {
      const response = await apiClient.get('/parse')
      return response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  },


  async searchPosts(searchWord) {
    try {
      const response = await apiClient.post('/parse', {
        searchWord: searchWord
      })

      const data = response.data


      if (data.success && data.results) {
        return data.results
      }


      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('Error searching posts:', error)
      throw error
    }
  }
}
