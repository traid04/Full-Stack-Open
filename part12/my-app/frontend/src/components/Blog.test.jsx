import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('Blog untoggled only renders title and author', () => {
    const blog = {
        title: 'testing',
        author: 'testing library',
        url: 'react.com',
        likes: 10,
        user: {
            name: 'Vitest'
        }
    }
    const userSession = blog.user

    const { container } = render(<Blog blog={blog} userSession={userSession} handleLike={vi.fn()} handleDelete={vi.fn()} />)
    const element = container.querySelector('.blog-simple')
    expect(element).toHaveTextContent(
        'testing testing library'
    )
    expect(element).not.toHaveTextContent('react.com')
    expect(element).not.toHaveTextContent('10')
})

test('Blog toggled renders URL and Likes', async () => {
    const blog = {
        title: 'testing',
        author: 'testing library',
        url: 'react.com',
        likes: 10,
        user: {
            name: 'Vitest'
        }
    }
    const { container } = render(<Blog blog={blog} handleLike={vi.fn()} userSession={blog.user} handleDelete={vi.fn()} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const element = container.querySelector('.blog-details')
    expect(element).toHaveTextContent('react.com')
    expect(element).toHaveTextContent('likes')
})

test('Like button is clicked twice correctly', async () => {
    const blog = {
        title: 'testing',
        author: 'testing library',
        url: 'react.com',
        likes: 10,
        user: {
            name: 'Vitest'
        }
    }
    const handleLike = vi.fn()
    const { container } = render(<Blog blog={blog} userSession={blog.user} handleLike={handleLike} handleDelete={vi.fn()} />)
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    const element = container.querySelector('.blog-details')
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(handleLike).toHaveBeenCalledTimes(2)
})