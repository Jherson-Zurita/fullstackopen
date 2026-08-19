import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = newToken ? `Bearer ${newToken}` : null
}

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data)
}

const getOne = (id) => {
  return axios.get(`${baseUrl}/${id}`).then((response) => response.data)
}

const create = async (newBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.post(baseUrl, newBlog, config)
  return response.data
}

const update = async (id, updatedBlog) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return response.data
}

const remove = async (id) => {
  const config = { headers: { Authorization: token } }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}

export default { getAll, getOne, create, update, remove, setToken }
