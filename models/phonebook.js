const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

console.log('Yhdistetään Mongoon...')

const url = process.env.MONGO_URL

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then( () => {
        console.log('Yhdistetty MongoDB!')
    }).catch( error => {
        console.log('Virhe yhdistettäess Mongoon!', error)
    })

const pBookSchema = new mongoose.Schema( {
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3
    },
    number: {
        type: String,
        required: true,
        minlength: 8
    }
})
pBookSchema.plugin(uniqueValidator)

pBookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
module.exports = mongoose.model('Person', pBookSchema)