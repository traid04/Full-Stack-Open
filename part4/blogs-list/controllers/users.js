const bcrypt = require('bcrypt')
const User = require('../models/user.js')
const Blog = require('../models/blog.js')
const usersRoutes = require('express').Router()
require('express-async-errors')

usersRoutes.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs', {url: 1, title: 1, author: 1})
    response.json(users)
})

usersRoutes.post('/', async (request, response) => {
    const { username, password, name } = request.body
    if (!username) {
        return response.status(400).json({"error": "User validation failed: username: Path `username` is required."})
    }
    if (username.length < 3) {
        return response.status(400).json({"error": "Username is shorter than the minimum allowed length (3 characters)"})
    }
    if (!password) {
        return response.status(400).json({"error": "User validation failed: password: Path `password` is required."})
    }
    if (password.length < 3) {
        return response.status(400).json({"error": "Password is shorter than the minimum allowed length (3 characters)"})
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const newUser = new User({
        username,
        name,
        passwordHash
    })
    const result = await newUser.save()
    response.status(201).json(result)
})

module.exports = usersRoutes