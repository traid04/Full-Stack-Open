import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import Input from './Input'

const AddBlogForm = ({ handleCreate }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        handleCreate({ title, author, url })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>title:</Form.Label>
                    <Form.Control
                        type="text"
                        name="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>author:</Form.Label>
                    <Form.Control
                        type="text"
                        name="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </Form.Group>
                <Form.Group>
                    <Form.Label>url:</Form.Label>
                    <Form.Control
                        type="text"
                        name="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </Form.Group>
                <div>
                    <Button type="submit" variant="success">
                        create
                    </Button>
                </div>
            </Form>
        </div>
    )
}

AddBlogForm.displayName = 'AddBlogForm'

export default AddBlogForm
