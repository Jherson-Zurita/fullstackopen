const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // crea un usuario y obtiene un token válido para los tests que lo requieren
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({ username: 'root', name: 'Superuser', passwordHash })
  const savedUser = await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'root', password: 'sekret' })

  token = loginResponse.body.token

  const blogObjects = helper.initialBlogs.map(
    (blog) => new Blog({ ...blog, user: savedUser._id })
  )
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})

describe('when there are initially some blogs saved', () => {
  // 4.8: GET devuelve la cantidad correcta de blogs, en JSON
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  // 4.9: la propiedad identificadora se llama "id", no "_id"
  test('unique identifier property is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach((blog) => {
      assert.ok(blog.id)
      assert.strictEqual(blog._id, undefined)
    })
  })
})

describe('addition of a new blog', () => {
  // 4.10: POST crea un nuevo blog
  test('succeeds with valid data and a valid token', async () => {
    const newBlog = {
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert.ok(titles.includes('Canonical string reduction'))
  })

  // 4.23*: sin token -> 401 Unauthorized
  test('fails with status 401 if token is not provided', async () => {
    const newBlog = {
      title: 'Blog without token',
      author: 'Anonymous',
      url: 'https://example.com',
      likes: 0
    }

    const blogsAtStart = await helper.blogsInDb()

    await api.post('/api/blogs').send(newBlog).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })

  // 4.11*: si falta "likes", por defecto es 0
  test('if likes property is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Someone',
      url: 'https://example.com/no-likes'
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    assert.strictEqual(response.body.likes, 0)
  })

  // 4.12*: si falta title o url -> 400
  test('fails with status 400 if title is missing', async () => {
    const newBlog = {
      author: 'Someone',
      url: 'https://example.com/no-title',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('fails with status 400 if url is missing', async () => {
    const newBlog = {
      title: 'Blog without url',
      author: 'Someone',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  // 4.13
  test('succeeds with status 204 if id is valid and user is the creator', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map((blog) => blog.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  // 4.21*: no se puede borrar sin token o con un usuario que no sea el creador
  test('fails with status 401 if no token is provided', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length)
  })
})

describe('updating a blog', () => {
  // 4.14
  test('succeeds in updating the number of likes', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedData = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedData)
      .expect(200)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
  })
})

after(async () => {
  await mongoose.connection.close()
})
