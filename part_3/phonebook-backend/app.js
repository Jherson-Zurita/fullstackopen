const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')

const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const personsRouter = require('./controllers/persons')
const Person = require('./models/person')

const app = express()

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// morgan con token personalizado que muestra el body en solicitudes POST (3.8)
morgan.token('body', (request) => {
  return request.method === 'POST' ? JSON.stringify(request.body) : ''
})
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
)

app.use(middleware.requestLogger)

app.use('/api/persons', personsRouter)

// GET /info — hora de la solicitud y cantidad de entradas (ejercicio 3.2)
app.get('/info', async (request, response) => {
  const count = await Person.countDocuments({})
  const requestTime = new Date()

  response.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${requestTime}</p>
  `)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
