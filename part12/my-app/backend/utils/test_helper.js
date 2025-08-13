const jwt = require('jsonwebtoken')
const User = require('../models/user.js')
const dotenv = require('dotenv')
dotenv.config()

const initialBlogs = [
    {
        _id: "685c999a8db2a3f933117bbc",
        title: "Test 1",
        author: "supertest",
        url: "test.com",
        user: "685f2d9af8ff8e6553a15310",
        likes: 2,
        __v: 0
    },
    {
        _id: "685c999a8db2a3f933117bbe",
        title: "Test 2",
        author: "supertest 2",
        url: "test222.com",
        user: "685f2d9af8ff8e6553a15310",
        likes: 10,
        __v: 0
    }
]

const initialUsers = [
    {
        _id: "685f2d3cf8ff8e6553a1530d",
        username: "traid",
        name: "Matihas",
        blogs: [],
        passwordHash: "$2b$10$YO2L6jJ3r2yLMWl60C73Sue8efrvlqsj/9vhlAI2C4Dxgbn.Gtj4m",
        __v : 0
    },
    {
        _id: "685f2d9af8ff8e6553a15310",
        username: "hellas",
        name: "Arto Hellas",
        blogs: [],
        passwordHash: "$2b$10$7WboKyUbBbjmPalZkdhEZ.tcpjlx8VgvOMmOoB1TO1sPUhKI/A7Xq",
        __v : 0
    }
]

const getToken = async () => {
    const user = await User.findOne({username: 'hellas'})
    const userForToken = {
        username: user.username,
        id: user._id
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    return token
}

module.exports = { initialBlogs, initialUsers, getToken }