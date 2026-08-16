import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
    })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((p) => p.name === newName)

    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`
      )
      if (!confirmUpdate) {
        return
      }

      const updatedPerson = { ...existingPerson, number: newNumber }

      personService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(persons.map((p) => (p.id !== existingPerson.id ? p : returnedPerson)))
          setNewName('')
          setNewNumber('')
          showNotification(`Updated ${returnedPerson.name}'s number`)
        })
        .catch(() => {
          showNotification(
            `Information of '${newName}' has already been removed from server`,
            'error'
          )
          setPersons(persons.filter((p) => p.id !== existingPerson.id))
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        showNotification(`Added ${returnedPerson.name}`)
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.error || 'Failed to add person'
        showNotification(errorMessage, 'error')
      })
  }

  const deletePerson = (person) => {
    const confirmDelete = window.confirm(`Delete ${person.name}?`)
    if (!confirmDelete) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
        showNotification(`Deleted ${person.name}`)
      })
      .catch(() => {
        showNotification(
          `Information of '${person.name}' has already been removed from server`,
          'error'
        )
        setPersons(persons.filter((p) => p.id !== person.id))
      })
  }

  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={notification.message} type={notification.type} />

      <Filter value={filter} onChange={(event) => setFilter(event.target.value)} />

      <h3>Add a new</h3>

      <PersonForm
        onSubmit={addPerson}
        newName={newName}
        onNameChange={(event) => setNewName(event.target.value)}
        newNumber={newNumber}
        onNumberChange={(event) => setNewNumber(event.target.value)}
      />

      <h3>Numbers</h3>

      <Persons persons={personsToShow} onDelete={deletePerson} />
    </div>
  )
}

export default App
