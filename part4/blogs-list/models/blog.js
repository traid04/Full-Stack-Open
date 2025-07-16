const mongoose = require('mongoose')
const config = require('../utils/config.js')

const blogSchema = new mongoose.Schema({
  url: String,
  title: String,
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: Number,
  comments: {
    type: [String],
    default: []
  }
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Blog = mongoose.model('blog', blogSchema)

mongoose.connect(config.MONGO_URI)

module.exports = Blog