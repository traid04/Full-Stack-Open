const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('/api/testing/reset')
        await request.post('/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen'
            }
        })

        await request.post('/api/users', {
            data: {
                name: 'Other User',
                username: 'otheruser',
                password: 'otheruser'
            }
        })

        const loginResponse = await request.post('/api/login', {
            data: {
                username: 'otheruser',
                password: 'otheruser'
            }
        })

        const loginToken = await loginResponse.json()
        const token = loginToken.token

        await request.post('/api/blogs', {
            data: {
                title: 'Test Blog (Delete Unauthorized)',
                author: 'Playwright',
                url: "Don't remove"
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        const usernameBox = page.getByPlaceholder('Username')
        const passwordBox = page.getByPlaceholder('Password')
        const loginBtn = page.getByRole('button', {name: 'login'})
        await expect(usernameBox).toBeVisible()
        await expect(passwordBox).toBeVisible()
        await expect(loginBtn).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await expect(page.getByText('mluukkai logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'WrongPassword')
            const locator = page.locator('.error')
            await expect(locator).toBeVisible()
            await expect(locator.getByText('invalid username or password')).toBeVisible()
        })
    })

    describe('When logged in', () => {
        
        test('a new blog can be created', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await createBlog(page, 'Testing Blog', 'Playwright', 'playwright.com')
            const locator = page.locator('.blog-simple')
            await expect(locator.getByText('Testing Blog Playwright')).toBeVisible()
        })

        test('a blog can be edited', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await page.getByRole('button', {name: 'view'}).first().click()
            const likesText = await page.locator('p', {hasText: 'likes'}).first().textContent()
            const initialLikes = Number(likesText.replace('likes ', ''))
            await page.getByRole('button', {name: 'like'}).click()
            const finalLikesText = await page.locator('p', {hasText: 'likes'}).first().textContent()
            const finalLikes = Number(finalLikesText)
            expect(finalLikes).toBe(initialLikes + 1)
        })

        test('a blog created by the user can be removed', async ({ page }) => {
            page.once('dialog', async dialog => {
                if (dialog.type() === 'confirm') {
                    await dialog.accept()
                } 
            })
            await loginWith(page, 'mluukkai', 'salainen')
            await createBlog(page, 'Can remove this', 'User', 'https://remove.com')
            await page.reload()
            const blogToRemove = await page.locator('.blog-simple', {hasText: 'Can remove this'})
            await blogToRemove.getByRole('button', {name: 'view'}).click()
            const blogDetails = await blogToRemove.locator('.blog-details')
            await expect(blogDetails).toBeVisible()
            const removeButton = await blogDetails.getByRole('button', {name: 'remove'})
            await removeButton.click()
            await expect(blogToRemove).not.toBeVisible()
        })

        test('only the blog creator can see the remove button', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            const blogToRemove = await page.locator('.blog-simple', {hasText: 'Test Blog (Delete Unauthorized)'})
            await blogToRemove.getByRole('button', {name: 'view'}).click()
            const blogDetails = blogToRemove.locator('.blog-details')
            const removeButton = await blogDetails.getByRole('button', {name: 'remove'})
            await expect(removeButton).not.toBeVisible()
        })

        test('the first place is the most liked blog', async ({ page }) => {
            await loginWith(page, 'mluukkai', 'salainen')
            await createBlog(page, 'Second most liked blog', '(Test)', 'https://1.com')
            await createBlog(page, 'Third most liked blog', '(Test)', 'https://2.com')
            const blogs = await page.locator('.blog-simple').all()
            for(let i = 0; i < blogs.length; i++) {
                await blogs[i].getByRole('button', {name: 'view'}).click()
                const blogDetails = await blogs[i].locator('.blog-details')
                const likeButton = await blogDetails.getByRole('button', {name: 'like'})
                if (i === 0) {
                    for(let i = 0; i < 3; i++) {
                        await likeButton.click()
                    }
                }
                else if (i === 1) {
                    for(let i = 0; i < 2; i++) {
                        await likeButton.click()
                    }
                }
                else if (i === 2) {
                    await likeButton.click()
                }
            }
            const blogsSorted = await page.locator('.blog-simple').all()
            await expect(blogsSorted[0]).toContainText('Test Blog (Delete Unauthorized)')
            await expect(blogsSorted[1]).toContainText('Second most liked blog')
            await expect(blogsSorted[2]).toContainText('Third most liked blog')
        })
    })
})