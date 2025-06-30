const { beforeEach, after, test, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app.js')
const Blog = require('../models/blog.js')
const testHelper = require('../utils/test_helper.js')
const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogs = testHelper.initialBlogs.map(blog => new Blog(blog))
    const promisesArray = blogs.map(blog => blog.save())
    await Promise.all(promisesArray)
})

describe('Blogs are returned correctly', () => {

    test('Blogs are returned as JSON', async () => {
        const token = await testHelper.getToken()
        await api
            .get('/api/blogs')
            .set('authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('All the blogs are returned', async () => {
        const token = await testHelper.getToken()
        const response = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        assert.strictEqual(response.body.length, testHelper.initialBlogs.length)
    })

    test(`The blog's unique identifier is named "id"`, async () => {
        const token = await testHelper.getToken()
        const response = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        const haveId = response.body.every(blog => blog.id)
        assert(haveId)
    })
})

describe('Blogs are added correctly', () => {
    test('Adding a blog fails with 401 if token is not provided', async () => {
        const newBlog = {
            title: "unauthorized",
            author: "supertest",
            url: "testUnauthorized.com",
            likes: 20
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })

    test('A individual blog is added correctly', async () => {
        const token = await testHelper.getToken()
        const newBlog = {
            title: "Test 3",
            author: "supertest 3",
            url: "test3333.com",
            likes: 4
        }
        await api
            .post('/api/blogs')
            .set('authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const response = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        const contentEqual = response.body.some(blog => 
            blog.title === newBlog.title && 
            blog.author === newBlog.author && 
            blog.url === newBlog.url &&
            blog.likes === newBlog.likes
        )
        assert.strictEqual(response.body.length, testHelper.initialBlogs.length + 1)
        assert(contentEqual)
    })

    test('A blog without "likes" key is added correctly', async () => {
        const token = await testHelper.getToken()
        const newBlog = {
            title: "Test 4 without likes",
            author: "supertest 4",
            url: "test4withoutlikes.com"
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .set('authorization', `Bearer ${token}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const response = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        const contentEqual = response.body.find(blog => 
            blog.title === newBlog.title && 
            blog.author === newBlog.author && 
            blog.url === newBlog.url
        )
        assert.strictEqual(response.body.length, testHelper.initialBlogs.length + 1)
        assert.strictEqual(contentEqual.likes, 0)
    })

    test('A blog without "title" and/or "url" key is not added', async () => {
        const token = await testHelper.getToken()
        const newBlog = {
            author: "supertest 5 error",
            url: "error.com",
            likes: 1234
        }
        await api
            .post('/api/blogs')
            .set('authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)
    })
})

describe('Blogs are deleted correctly', () => {
    test('Deleting blog by id', async () => {
        const token = await testHelper.getToken()
        const initialData = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        const id = initialData.body[0].id
        await api
            .delete(`/api/blogs/${id}`)
            .set('authorization', `Bearer ${token}`)
            .expect(204)
        const response = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
        const deleted = response.body.some(blog => blog.id === id)
        assert(!deleted)
    })
})

test('Blogs are updated correctly', async () => {
    const token = await testHelper.getToken()
    const initialData = await api.get('/api/blogs').set('authorization', `Bearer ${token}`)
    const id = initialData.body[0].id
    const newBlog = {
        id,
        title: 'Updated title', 
        url: 'new URL', 
        author: initialData.body[0].author,
        user: initialData.body[0].user,
        likes: 452
    }
    await api
        .put(`/api/blogs/${id}`)
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    const response = await api.get(`/api/blogs`).set('authorization', `Bearer ${token}`)
    const updated = response.body.find(blog => blog.id === id)
    assert.deepStrictEqual(newBlog, updated)
})

after(async () => {
    await mongoose.connection.close()
})