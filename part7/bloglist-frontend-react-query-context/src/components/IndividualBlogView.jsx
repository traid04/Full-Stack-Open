import { useState, useContext } from 'react'
import { useMatch } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, Button } from 'react-bootstrap'
import blogService from '../services/blogs.js'
import UserContext from '../UserContext.jsx'
import '../index.css'
import BlogsHeader from './BlogsHeader.jsx'

const IndividualBlogView = ({ handleLogout }) => {
    const [comment, setComment] = useState('')
    const [user] = useContext(UserContext)
    const token = user.token
    const match = useMatch('/blogs/:id')
    const id = match ? match.params.id : null

    const queryClient = useQueryClient()
    const likeBlogMutation = useMutation({
        mutationFn: async ({ blog, token }) => {
            const result = await blogService.update(blog, token)
            return result
        },
        onSuccess: (newBlog) => {
            const data = queryClient.getQueryData(['blogs'])
            queryClient.setQueryData(
                ['blogs'],
                data.map((blog) =>
                    blog.id === newBlog.id
                        ? { ...blog, likes: blog.likes + 1 }
                        : blog
                )
            )
        },
    })

    const handleLike = async (blog) => {
        const newBlog = {
            title: blog.title,
            author: blog.author,
            url: blog.url,
            _id: blog.id,
            user: blog.user,
            likes: blog.likes + 1,
        }
        try {
            likeBlogMutation.mutate({ blog: newBlog, token: user.token })
        } catch (error) {
            console.log(error)
        }
    }
    const handleComment = async (e) => {
        e.preventDefault()
        await blogService.addComment(id, { comment }, token)
        setComment('')
        queryClient.invalidateQueries(['blogs'])
    }

    const blogs = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => await blogService.getAll(token),
    })

    if (blogs.isLoading) {
        return <div>loading blog...</div>
    }

    const blogToRender = blogs.data.find((blog) => blog.id === id)

    return (
        <div className="container">
            <BlogsHeader user={user} handleLogout={handleLogout} />
            <h2>
                {blogToRender.title} {blogToRender.author}
            </h2>
            <a href={`${blogToRender.url}`} target="__blank">
                {blogToRender.url}
            </a>
            <p>
                {blogToRender.likes} likes{' '}
                <Button
                    variant="success"
                    onClick={() => handleLike(blogToRender)}
                    size="sm"
                >
                    like
                </Button>
            </p>
            <p>added by {blogToRender.user.name}</p>
            <h2>comments</h2>
            {blogToRender.comments.length > 0 ? (
                <ul>
                    {blogToRender.comments.map((comment, index) => (
                        <li key={index}>{comment}</li>
                    ))}
                </ul>
            ) : (
                <h2>there are no comments yet, you can be the first</h2>
            )}
            <div>
                <Form onSubmit={handleComment}>
                    <Form.Group>
                        <Form.Control
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        add comment
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default IndividualBlogView
