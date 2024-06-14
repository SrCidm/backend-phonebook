const mongoose = require('mongoose')
require('dotenv').config()

const Person = mongoose.model('Person', {
  name: String,
  number: String,
})

const url = process.env.MONGO_URI

mongoose.set('strictQuery', false)
mongoose.connect(url)

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
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error fetching phonebook:', error)
    mongoose.connection.close()
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
    mongoose.connection.close()
  }).catch(error => {
    console.error('Error saving person:', error)
    mongoose.connection.close()
  })
}



// const person = new Person({
//   name: 'Sergio Wong',
//   number: '+3487985543',
// });