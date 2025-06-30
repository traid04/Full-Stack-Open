const supertest = require('supertest')
const assert = require('node:assert')
const { beforeEach, describe, test, after } = require('node:test')
const mongoose = require('mongoose')
const app = require('../app.js')
const User = require('../models/user.js')
const testHelper = require('../utils/test_helper.js')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const users = testHelper.initialUsers.map(user => new User(user))
    const promisesArray = users.map(user => user.save())
    await Promise.all(promisesArray)
})

describe('User is', () => {

    test('Valid and correctly added', async () => {
        const newUser = {
            username: 'correct name',
            name: 'supertest adding user correctly',
            password: 'correctpassword'
        }
        const response = await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const expectedUser = {
            username: 'correct name',
            name: 'supertest adding user correctly',
            blogs: [],
            id: response.body.id
        }
        assert.deepStrictEqual(response.body, expectedUser)
    })

    test('Not valid if !password', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'testname',
                name: 'supertest adding user 1'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(response.body, {"error": "User validation failed: password: Path `password` is required."})
    })

    test('Not valid if !username', async () => {
        const response = await api
            .post('/api/users')
            .send({
                name: 'supertest adding user 1',
                password: 'testpassword'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(response.body, {"error": "User validation failed: username: Path `username` is required."})
    })

    test('Not valid if the username is not unique', async () => {    
        const response = await api
            .post('/api/users')
            .send({
                username: testHelper.initialUsers[0].username,
                name: 'supertest adding user 1',
                password: 'testpassword'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(response.body, {error: 'Expected `username` to be unique.'})  
    })

    test('Not valid if the username has less than 3 characters', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'st',
                name: 'supertest adding user 1',
                password: 'testpassword'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(response.body, {"error": "Username is shorter than the minimum allowed length (3 characters)"})
    })

    test('Not valid if the password has less than 3 characters', async () => {
        const response = await api
            .post('/api/users')
            .send({
                username: 'test username',
                name: 'supertest adding user 1',
                password: 'tp'
            })
            .expect(400)
            .expect('Content-Type', /application\/json/)
        assert.deepStrictEqual(response.body, {"error": "Password is shorter than the minimum allowed length (3 characters)"})
    })
})

after(async () => {
    mongoose.connection.close()
})