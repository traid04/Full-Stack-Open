const mongoose = require('mongoose')
const config = require('../utils/config.js')

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    blogs : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'blog'
        }
    ],
    name: String,
    passwordHash: String
})

usersSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('user', usersSchema)

mongoose.connect(config.MONGO_URI)

module.exports = User