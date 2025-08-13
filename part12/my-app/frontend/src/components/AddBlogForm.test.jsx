import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'
import Togglable from './Togglable'

describe('<Togglable />', () => {
    const mockHandler = vi.fn()
    beforeEach(() => {
        render(
            <Togglable buttonLabel="create new blog" hideLabel="cancel">
                <AddBlogForm handleCreate={mockHandler} />
            </Togglable>
        )
    })

    test('Blog added correctly', async () => {
        const user = userEvent.setup()
        const createButton = screen.getByText('create new blog')
        await user.click(createButton)
        const inputTitle = screen.getByPlaceholderText('title')
        const inputAuthor = screen.getByPlaceholderText('author')
        const inputUrl = screen.getByPlaceholderText('url')
        const sendButton = screen.getByText('create')
        await userEvent.type(inputTitle, 'testing title')
        await userEvent.type(inputAuthor, 'vitest')
        await userEvent.type(inputUrl, 'react.com')
        await userEvent.click(sendButton)
        expect(mockHandler.mock.calls).toHaveLength(1)
        expect(mockHandler.mock.calls[0][0].title).toBe('testing title')
        expect(mockHandler.mock.calls[0][0].author).toBe('vitest')
        expect(mockHandler.mock.calls[0][0].url).toBe('react.com')
    })
})