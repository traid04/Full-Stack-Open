import axios from 'axios'
const baseUrl = '/api/blogs'

const getAll = token => {
  const newToken = `Bearer ${token}`
  const config = {
    headers: { Authorization: newToken }
  }
  const request = axios.get(baseUrl, config)
  return request.then(response => response.data)
}

const create = async (blog, token) => {
  const newToken = `Bearer ${token}`
  const config = {
    headers: { Authorization: newToken }
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const addComment = async (id, comment, token) => {
  const newToken = `Bearer ${token}`
  const config = {
    headers: { Authorization: newToken }
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, comment, config)
  return response.data
}

const update = async (newBlog, token) => {
  const newToken = `Bearer ${token}`
  const config = {
    headers: { Authorization: newToken }
  }
  const id = newBlog._id
  const response = await axios.put(`${baseUrl}/${id}`, newBlog, config)
  return response.data
}

const remove = async (id, token) => {
  const newToken = `Bearer ${token}`
  const config = {
    headers: { Authorization: newToken }
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, create, update, remove, addComment }