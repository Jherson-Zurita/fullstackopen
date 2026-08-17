const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: {
      validator: function (value) {
        // dos o tres números, un guión, y luego solo números
        return /^\d{2,3}-\d+$/.test(value)
      },
      message: (props) =>
        `${props.value} is not a valid phone number. It must have the format XX-XXXXXXX or XXX-XXXXXXX`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
