import { useState, useRef, useReducer, useContext } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Form, Button } from 'react-bootstrap'
import Notification from './Notification'
import Blog from './Blog'
import AddBlogForm from './AddBlogForm'
import Togglable from './Togglable'
import blogService from '../services/blogs'
import loginService from '../services/login'
import UserContext from '../UserContext'
import BlogsHeader from './BlogsHeader'

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'TOGGLE':
            return action.payload
        default:
            return state
    }
}

const Home = ({ handleLogout }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const [notification, notificationDispatch] = useReducer(
        notificationReducer,
        { msg: '', typeAlert: '' }
    )
    const [user, userDispatch] = useContext(UserContext)

    const blogToggleRef = useRef()

    const queryClient = useQueryClient()

    const newBlogMutation = useMutation({
        mutationFn: async ({ newBlog, token }) => {
            const result = await blogService.create(newBlog, token)
            return result
        },
        onSuccess: (blog) => {
            const data = queryClient.getQueryData(['blogs'])
            queryClient.setQueryData(['blogs'], data.concat(blog))
        },
        onError: (error) => {
            notificationDispatch({
                type: 'TOGGLE',
                payload: {
                    msg: error.response.data.error,
                    typeAlert: 'danger',
                },
            })
            setTimeout(() => {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: { msg: '', typeAlert: '' },
                })
            }, 5000)
        },
    })

    const result = useQuery({
        queryKey: ['blogs'],
        queryFn: async () => await blogService.getAll(user.token),
        enabled: !!user,
    })

    if (result.isLoading) {
        return <div>loading data...</div>
    }

    const blogs = result.data

    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const response = await loginService.login({ username, password })
            userDispatch({ type: 'SET_USER', payload: response })
            notificationDispatch({
                type: 'TOGGLE',
                payload: {
                    msg: `welcome ${response.username}`,
                    typeAlert: 'success',
                },
            })
            setTimeout(() => {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: {
                        msg: '',
                        typeAlert: '',
                    },
                })
            }, 3000)
            setUsername('')
            setPassword('')
            window.localStorage.setItem(
                'loggedBlogappUser',
                JSON.stringify(response)
            )
        } catch (error) {
            notificationDispatch({
                type: 'TOGGLE',
                payload: {
                    msg: error.response.data.error,
                    typeAlert: 'danger',
                },
            })
            setTimeout(() => {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: {
                        msg: '',
                        typeAlert: '',
                    },
                })
            }, 3000)
        }
    }

    const handleCreate = async ({ title, author, url }) => {
        try {
            newBlogMutation.mutate({
                newBlog: { title, author, url },
                token: user.token,
            })
            notificationDispatch({
                type: 'TOGGLE',
                payload: {
                    msg: `A new blog ${title} by ${author} added`,
                    typeAlert: 'success',
                },
            })
            blogToggleRef.current.toggle()
            setTimeout(() => {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: { msg: '', typeAlert: '' },
                })
            }, 5000)
        } catch (error) {
            notificationDispatch({
                type: 'TOGGLE',
                payload: {
                    msg: error.response.data.error,
                    typeAlert: 'danger',
                },
            })
            setTimeout(() => {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: { msg: '', typeAlert: '' },
                })
            }, 5000)
        }
    }

    const handleDelete = async (blogToRemove) => {
        const confirm = window.confirm(
            `Remove blog ${blogToRemove.title} by ${blogToRemove.author}`
        )
        if (confirm) {
            try {
                await blogService.remove(blogToRemove.id, user.token)
                const data = queryClient.getQueryData(['blogs'])
                queryClient.setQueryData(
                    ['blogs'],
                    data.filter((blog) => blog.id !== blogToRemove.id)
                )
            } catch (error) {
                notificationDispatch({
                    type: 'TOGGLE',
                    payload: {
                        msg: error.response.data.error,
                        typeAlert: 'danger',
                    },
                })
                setTimeout(() => {
                    notificationDispatch({
                        type: 'TOGGLE',
                        payload: { msg: '', typeAlert: '' },
                    })
                }, 5000)
            }
        }
    }

    if (user === null) {
        return (
            <div className="container">
                <BlogsHeader user={user} />
                <h1>login</h1>
                <Notification
                    message={notification.msg}
                    typeAlert={notification.typeAlert}
                />
                <div>
                    <Form onSubmit={handleLogin}>
                        <Form.Group>
                            <Form.Label>username:</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>password:</Form.Label>
                            <Form.Control
                                name="password"
                                value={password}
                                type="password"
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            login
                        </Button>
                    </Form>
                </div>
            </div>
        )
    }

    return (
        <div className="container">
            <BlogsHeader user={user} handleLogout={handleLogout} />
            <h2>blogs</h2>
            <Notification
                message={notification.msg}
                typeAlert={notification.typeAlert}
            />
            <div>
                <Togglable
                    buttonLabel="create new blog"
                    hideLabel="cancel"
                    ref={blogToggleRef}
                >
                    <AddBlogForm handleCreate={handleCreate} />
                </Togglable>
            </div>
            <Table striped>
                <tbody>
                    {blogs
                        .sort((a, b) => b.likes - a.likes)
                        .map((blog) => (
                            <Blog
                                key={blog.id}
                                blog={blog}
                                handleDelete={handleDelete}
                                userSession={user}
                            />
                        ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Home
