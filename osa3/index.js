const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

let persons = [
    {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
    },
    {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
    },
    {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
    },
    {
      "name": "Jonna Kutvonen",
      "number": "040-123456",
      "id": 4
    }
  ]

app.get('/', (req, res) => {
  res.send('<h1>Hello</h1>') 
})

// GENERATE ID
const generateId = () => {
  const maxId = persons.length > 0 ? persons.map(n => n.id).sort((a,b) => a - b).reverse()[0] : 1
  return maxId + 1
}

const randomId = () => {
  console.log('randomId')
  function getRandomInt() {
    return Math.floor(Math.random() * Math.floor(200));
  }
  let idNumber = getRandomInt()
  console.log('numero on: '+idNumber)
  console.log('numero on käytössä: '+(persons.find(person => person.id === idNumber) !== undefined))
  while (persons.find(person => person.id === idNumber) !== undefined){
    idNumber++
    console.log('uusi numero: '+idNumber)
    console.log('numero on käytössä: '+(persons.find(person => person.id === idNumber) !== undefined))
  }
  console.log('numero hyvaksytty')
  return idNumber
}

//GET PERSONS
app.get('/api/persons', (req, res) => {
  res.json(persons)
})

//GET PERSON ID
app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log(id)
  const person = persons.find(person => person.id === id)
  if ( person ) {
    res.json(person)
  } else {
    res.status(400).json({error: 'no content'})
  }
})

//DELETE
app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  console.log("delete")
  console.log(persons)
  res.status(204).end()
})

//POST
app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log('new person')
  console.log(body)
  //console.log(body.number)
  //console.log(body.name)
  console.log('number test')
  if (body.number === undefined || body.number === "") {
    console.log('error: number')
    return res.status(400).json({error: 'number missing'})
  }
  console.log('name test')
  if (persons.find(person => person.name === body.name) !== undefined) {
    console.log('error: name')
    return res.status(400).json({ error: 'name must be unique' })
  }
  const person = {
    "name": body.name,
    "number": body.number,
    "id": randomId()
  }
  console.log('person add')
  persons = persons.concat(person)
  res.json(person)
  console.log(persons)
})

//LOG
const logger = (req, res, next) => {
  console.log('Method:',req.method)
  console.log('Path:  ', req.path)
  console.log('Body:  ', req.body)
  console.log('---')
  next()
}
app.use(logger)
//ERROR
const error = (req, res) => {
  res.status(404).json({error: 'unknown endpoint'})
}
app.use(error)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})