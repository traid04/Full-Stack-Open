const commentsRoutes = require('express').Router({ mergeParams: true })
require('express-async-errors')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

commentsRoutes.get('/', async (request, response) => {
    const blogs = await Blog.findById(request.params.id)
    response.json(blogs.comments)
})

commentsRoutes.post('/', async (request, response) => {
    const newComment = request.body.comment
    const blogToAdd = await Blog.findById(request.params.id)
    if (!blogToAdd) {
        return response.status(404).json({ error: 'Blog not found' })
    }
    blogToAdd.comments.push(newComment)
    const result = await blogToAdd.save()
    response.status(201).json(result)
})


module.exports = commentsRoutes