const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: error.message })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  if (error.name === 'MongoServerError' && error.message.includes(`E11000 duplicate key error`)) {
    return response.status(400).json({error: 'Expected `username` to be unique.'})
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({error: 'invalid token'})
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '')
  }
  else {
    request.token = null
  }
  next()
}

const userExtractor = (request, response, next) => {
  request.user = jwt.verify(request.token, process.env.SECRET)
  next()
}

module.exports = {errorHandler, tokenExtractor, userExtractor}