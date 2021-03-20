const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('jsonData', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(morgan( (tokens, req, res) => {
    return [
        tokens.method(req, res),
        tokens.url(req, res),
        tokens.status(req, res),
        tokens.res(req, res, 'content-length'), '-',
        tokens['response-time'](req, res), 'ms',
        tokens.jsonData(req, res)
    ].join(' ')
}))

let phonebook = [
    {
        id: 1,
        name: "Test Person",
        number: "911",
    },
    {
        id: 2,
        name: "Second Man",
        number: "112",
    }
]
    
app.get('/persons', (req, res) => {
    res.json(phonebook)
})
app.get('/info', (req, res) => {
    res.send(`<p>Puhelinluettelossa ${phonebook.length} henkilöä</p>\n<p>${new Date()}</p>`)
})
app.post(`/persons`, (req, res) => {
    const body = req.body
    if (!body.name) return res.status(400).json( { error: 'Anna nimi'})
    else if (!body.number) return res.status(400).json( { error: 'Anna numero'})

    const samanNimiset = phonebook.filter(field => field.name === body.name)
    
    if (samanNimiset.length > 0)
        return res.status(400).json( { error: 'Nimi on jo listalla'})

    const newPerson = {
        name: body.name,
        number: body.number,
        id: getRandomId(),
    }
    phonebook = phonebook.concat(newPerson)
    res.json(newPerson)
    
})
app.delete(`/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    phonebook = phonebook.filter(field => field.id !== id)
    res.status(204).end()
})
app.get(`/persons/:id`, (req, res) => {
    const id = Number(req.params.id)
    const field = phonebook.find(note => note.id === id)
    if (field) {
        res.json(field)
    } else {
        res.status(404).end()
    }

})

const tuntematonSivu = (req, res) => {
    res.status(404).send({ error: 'Sivua ei löydy'})
}
app.use(tuntematonSivu)

const getRandomId = () => Math.floor(Math.random() * 10000000 )



const PORT = process.env.PORT || 3001

app.listen(PORT, ()=>{
    console.log(`Kuunnellaan porttia ${PORT}`)
})