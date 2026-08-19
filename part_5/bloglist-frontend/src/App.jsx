import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate, useParams, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'

import BlogDetails from './components/BlogDetails'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Navigation from './components/Navigation'
import Users from './views/Users'
import UserDetails from './views/UserDetails'
import CreateBlog from './views/CreateBlog'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/users'

// lee el usuario de localStorage de forma perezosa al inicializar el estado,
// evitando así llamar a setState dentro de un useEffect (regla react-hooks/set-state-in-effect)
const getStoredUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  return loggedUserJSON ? JSON.parse(loggedUserJSON) : null
}

// Componentes de ruta declarados fuera de App para que no se recreen en cada render
// (regla react-hooks/static-components)
const BlogView = ({ blogs, user, onLike, onDelete }) => {
  const { id } = useParams()
  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <div>Blog not found</div>
  }

  return (
    <BlogDetails
      blog={blog}
      user={user}
      onLike={() => onLike(blog)}
      onDelete={() => onDelete(blog)}
    />
  )
}

const UserView = ({ users }) => {
  const { id } = useParams()
  const foundUser = users.find((u) => u.id === id)
  return <UserDetails user={foundUser} />
}

BlogView.propTypes = {
  blogs: PropTypes.array.isRequired,
  user: PropTypes.object,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
}

UserView.propTypes = {
  users: PropTypes.array.isRequired
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(getStoredUser)
  const [notification, setNotification] = useState({ message: null, type: null })

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then((initialBlogs) => setBlogs(initialBlogs))
  }, [])

  useEffect(() => {
    userService.getAll().then((initialUsers) => setUsers(initialUsers))
  }, [])

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
    }
  }, [user])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification({ message: null, type: null }), 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const loggedUser = await loginService.login(credentials)
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(loggedUser))
      setUser(loggedUser)
      showNotification(`Welcome back, ${loggedUser.name}`)
      navigate('/')
    } catch {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
  }

  const createBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      const populatedBlog = { ...createdBlog, user }
      setBlogs(blogs.concat(populatedBlog))
      showNotification(`a new blog "${blogObject.title}" by ${blogObject.author} added`)
      navigate('/')
    } catch {
      showNotification('creating the blog failed', 'error')
    }
  }

  const likeBlog = async (blog) => {
    try {
      const updatedBlog = {
        title: blog.title,
        author: blog.author,
        url: blog.url,
        likes: blog.likes + 1,
        user: blog.user ? blog.user.id : undefined
      }
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      setBlogs(
        blogs.map((b) => (b.id === blog.id ? { ...returnedBlog, user: blog.user } : b))
      )
    } catch {
      showNotification('updating the blog failed', 'error')
    }
  }

  const deleteBlog = async (blog) => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      return
    }
    try {
      await blogService.remove(blog.id)
      setBlogs(blogs.filter((b) => b.id !== blog.id))
      showNotification(`blog "${blog.title}" removed`)
      navigate('/')
    } catch {
      showNotification('removing the blog failed', 'error')
    }
  }

  return (
    <div>
      <Navigation user={user} onLogout={handleLogout} />

      <h1>Blog app</h1>

      <Notification message={notification.message} type={notification.type} />

      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate replace to="/" /> : <LoginForm onLogin={handleLogin} />}
        />
        <Route path="/users" element={<Users users={users} />} />
        <Route path="/users/:id" element={<UserView users={users} />} />
        <Route
          path="/blogs/:id"
          element={
            <BlogView blogs={blogs} user={user} onLike={likeBlog} onDelete={deleteBlog} />
          }
        />
        <Route
          path="/blogs/new"
          element={
            user ? <CreateBlog createBlog={createBlog} /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/"
          element={
            <BlogList blogs={blogs} user={user} onLike={likeBlog} onDelete={deleteBlog} />
          }
        />
      </Routes>
    </div>
  )
}

export default App
