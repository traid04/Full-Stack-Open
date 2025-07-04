const { test, expect, beforeEach, describe } = require('@playwright/test')

const loginWith = async (page, user, pass) => {
    await page.getByPlaceholder('Username').fill(user)
    await page.getByPlaceholder('Password').fill(pass)
    await page.getByRole('button', {name: 'login'}).click()
}

const createBlog = async(page, title, author, url) => {
    await page.getByRole('button', {name: 'create new blog'}).click()
    await page.getByPlaceholder('title').fill(title)
    await page.getByPlaceholder('author').fill(author)
    await page.getByPlaceholder('url').fill(url)
    await page.getByRole('button', {name: 'create'}).click()
}

module.exports = { loginWith, createBlog }