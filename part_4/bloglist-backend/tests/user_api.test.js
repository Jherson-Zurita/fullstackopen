const { test, describe, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((user) => user.username)
    assert.ok(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    assert.match(result.body.error, /unique/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'salainen'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.match(result.body.error, /required/)
  })

  test('creation fails if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'shortpw',
      name: 'Short Password',
      password: 'ab'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.match(result.body.error, /at least 3 characters/)
  })

  test('creation fails if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'salainen'
    }

    const result = await api.post('/api/users').send(newUser).expect(400)
    assert.match(result.body.error, /at least 3 characters/)
  })
})

after(async () => {
  await mongoose.connection.close()
})
