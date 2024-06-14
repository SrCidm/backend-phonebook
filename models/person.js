const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('Connected to  MongoDB')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3
  },
  number: {
    type: String,
    required: true,
    minLength: 8,
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.value} This is not a valid phone number. The format should be xx-xxxxxxx or xxx-xxxxxxx.`
    }
  },
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person',personSchema)


if (process.argv.length < 3) {
  console.log('Please provide the password as an argument')
  process.exit(1)
}

if (process.argv.length === 3) {
  console.log('Phonebook:')
  Person.find({}).then(persons => {
    persons.forEach(person => {
      console.log(`${person.name} ${person.number}`)
    })

  }).catch(error => {
    console.error('Error fetching phonebook:', error)

  })
}

else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]


  if (!name || !number) {
    console.log('Please provide both name and number')
    process.exit(1)
  }

  const person = new Person({
    name: name,
    number: number,
  })



  person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
  }).catch(error => {
    console.error('Error saving person:', error)
  })
}

module.exports = { Person, personSchema }