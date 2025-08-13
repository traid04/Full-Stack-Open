const blogsRoutes = require('express').Router()
require('express-async-errors')
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

blogsRoutes.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', {username: 1, name: 1})
  response.json(blogs)
})

blogsRoutes.post('/', async (request, response) => {
  let newBlog = new Blog(request.body)
  const decodedToken = request.user
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).json({error: 'title and url are required'})
  }
  if (!newBlog.likes) {
    newBlog.likes = 0
  }
  const user = await User.findById(decodedToken.id)
  newBlog.user = user.id
  const result = await newBlog.save()
  user.blogs = user.blogs.concat(result.id)
  await user.save()
  response.status(201).json(result)
})

blogsRoutes.delete('/:id', async (request, response) => {
  const decodedToken = request.user
  const id = request.params.id
  const blog = await Blog.findById(id)
  if (!blog) {
    return response.status(404).json({error: "blog doesn't exist"})
  }
  if ((blog.user.toString() === decodedToken.id)) {
    await Blog.findByIdAndDelete(id)
    return response.status(204).end()
  }
  return response.status(401).json({error: 'no permission'})
})

blogsRoutes.put('/:id', async (request, response) => {
  const id = request.params.id
  const body = request.body
  const updatedBlog = {
    title: body.title, 
    url: body.url, 
    author: body.author, 
    likes: body.likes
  }
  if (request.body.title && request.body.url) {
    const result = await Blog.findByIdAndUpdate(id, updatedBlog, {new: true})
    if (result !== null) {
      return response.status(200).json(result)
    }
    else {
      return response.status(404).json({error: 'Blog not found'})
    }
  }
  else {
    return response.status(400).json({error: 'Blog invalid'})
  }
})

module.exports = blogsRoutes