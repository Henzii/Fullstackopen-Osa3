const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

require('dotenv').config()

const pBook = require('./models/phonebook')

app.use(cors())
app.use(express.json())
app.use(express.static('build'))

morgan.token('jsonData', (req) => {
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
app.get('/persons', (req, res, next) => {
    pBook.find({}).then(tiedot => {
        res.json(tiedot)
    }).catch(error => next(error))
})
app.get('/info', (req, res) => {
    pBook.count().then(vastaus => {
        res.send(`
            <p>Puhelinluettelossa yhteensä <b>${vastaus}</b> henkilöä. ${new Date}</p>
        `)
    })
})
app.post('/persons', (req, res, next) => {
    const body = req.body
    const newPerson = new pBook({
        name: body.name,
        number: body.number,
    })
    newPerson.save().then(uusi => {
        res.json(uusi)
    }).catch(error => next(error))
})
app.delete('/persons/:id', (req, res, next) => {
    const id = req.params.id
    pBook.findByIdAndRemove(id).then(() => {
        res.status(204).end()
    }).catch(error => next(error))

})
app.put('/persons/:id', (req, res, next) => {
    const uusiPerson = {
        number: req.body.number
    }
    console.log(uusiPerson)
    pBook.findByIdAndUpdate(req.params.id, uusiPerson, { new: true })
        .then(vastaus => {
            res.json(vastaus)
        }).catch(error => next(error))
})
app.get('/persons/:id', (req, res, next) => {
    const id = req.params.id
    pBook.findById(id).then(vastaus => {
        if (vastaus) {
            res.json(vastaus)
        } else {
            res.status(404).end()
        }
    }).catch(error => next(error))

})

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        response.status(400).send( { error: 'Epäkelpo id' })
    } else if (error.name === 'ValidationError') {
        response.status(400).send( { error: error.message })
    }
    next(error)
}
app.use(errorHandler)
const tuntematonSivu = (req, res) => {
    res.status(404).send({ error: 'Sivua ei löydy' })
}
app.use(tuntematonSivu)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Kuunnellaan porttia ${PORT}`)
})