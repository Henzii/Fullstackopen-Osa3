
const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('Ei tarpeeksi parametrejä...')
    process.exit(0)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackopen:${password}@cluster0.xqisd.mongodb.net/phonebook?retryWrites=true&w=majority`


mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const pBookSchema = new mongoose.Schema( {
    name: String,
    number: String
})

const Person = mongoose.model('Person', pBookSchema)

// Jos vain salasana annettu
if (process.argv.length === 3) {
    console.log('Phonebook:')
    Person.find({}).then(res => {
        res.forEach( p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
} else {

    const pName = process.argv[3]
    const pNumber = process.argv[4]

    const newPerson = new Person( {
        name: pName,
        number: pNumber
    })

    newPerson.save().then(() => {
        console.log(`added ${pName} number ${pNumber} to phonebook`)
        mongoose.connection.close()
    })
}