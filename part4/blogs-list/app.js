const express = require('express')
const app = express()
const blogsRoutes = require('./controllers/blogs.js')
const usersRoutes = require('./controllers/users.js')
const loginRoutes = require('./controllers/login.js')
const commentsRoutes = require('./controllers/comments.js')
const middleware = require('./utils/middleware.js')

app.use(express.json())
app.use(middleware.tokenExtractor)
if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}
app.use('/api/blogs', middleware.userExtractor, blogsRoutes)
app.use('/api/users', usersRoutes)
app.use('/api/login', loginRoutes)
app.use('/api/blogs/:id/comments', commentsRoutes)
app.use(middleware.errorHandler)

module.exports = app