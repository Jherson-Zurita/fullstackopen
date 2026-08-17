const personsRouter = require('express').Router()
const Person = require('../models/person')

// GET /api/persons — lista completa (3.1, 3.13)
personsRouter.get('/', async (request, response) => {
  const persons = await Person.find({})
  response.json(persons)
})

// GET /api/persons/:id — una sola entrada (3.3, 3.18)
personsRouter.get('/:id', async (request, response, next) => {
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// POST /api/persons — crear (3.5, 3.6, 3.14, 3.19, 3.20)
personsRouter.post('/', async (request, response, next) => {
  const { name, number } = request.body

  if (!name || !number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const existingPerson = await Person.findOne({ name })
  if (existingPerson) {
    return response.status(400).json({ error: 'name must be unique' })
  }

  const person = new Person({ name, number })

  try {
    const savedPerson = await person.save()
    response.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
})

// PUT /api/persons/:id — actualizar número (3.17, validadores activados en update: 3.19)
personsRouter.put('/:id', async (request, response, next) => {
  const { name, number } = request.body

  try {
    const updatedPerson = await Person.findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedPerson) {
      response.json(updatedPerson)
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

// DELETE /api/persons/:id — eliminar (3.4, 3.15)
personsRouter.delete('/:id', async (request, response, next) => {
  try {
    const result = await Person.findByIdAndDelete(request.params.id)
    if (result) {
      response.status(204).end()
    } else {
      response.status(404).end()
    }
  } catch (error) {
    next(error)
  }
})

module.exports = personsRouter
