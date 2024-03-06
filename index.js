const express = require('express');
const morgan = require('morgan');
const cors = require('cors')
const app = express()

const persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(cors())

app.use((request, response, next) => { request.start=new Date(Date.now()); next(); })

app.use(express.json())

morgan.token('postBody', function(req, res) {
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
  response.send(200, `<p>Phonebook has info for ${persons.length} people<p/><p>${request.start}<p/>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  if(persons.at(id)) {
    persons.filter(p=>p.id!==id)
    response.status(204).end()
  } else {
    response.status(404).json({error: "No such id found"})
  }
})

app.post('/api/persons', (request, response) => {
  const person = request.body
  if (!person.name || !person.number) {
    response.status(400).json({error: "The name or number is missing"})
  }
  if (persons.find(p => p.name === person.name)) {
    response.status(409).json({error: "The name already exists in the phonebook"})
  }
  const data = {...person, id: Math.round(Math.random() * 1000000, 0)}
  response.json(data)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
})