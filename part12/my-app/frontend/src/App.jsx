import { useState, useEffect, useRef } from 'react'
import './index.css'
import Blog from './components/Blog'
import AddBlogForm from './components/AddBlogForm'
import Input from './components/Input'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import { toggleView } from './reducers/notificationReducer.js'
import { useDispatch, useSelector } from 'react-redux'
import { initializeBlogs, createBlog, setBlogs, plusLike } from './reducers/BlogsReducer.js'
import { setUser } from './reducers/userReducer.js'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const user = useSelector(state => state.user)
  const blogsState = useSelector(state => state.blogs)

  const blogToggleRef = useRef()

  useEffect(() => {
    if (user) {
      dispatch(initializeBlogs(user.token))
    }
  }, [user])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      dispatch(setUser(JSON.parse(loggedUser)))
    }
  }, [])
  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await loginService.login({ username, password })
      dispatch(setUser(response))
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response))
    }
    catch(error) {
      dispatch(toggleView({msg: error.response.data.error, typeAlert: 'error'}))
      setTimeout(() => {
        dispatch(toggleView({msg: '', typeAlert: ''}))
      }, 5000)
    }
  }

  const handleLogout = e => {
    e.preventDefault()
    dispatch(setUser(null))
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreate = async ({title, author, url}) => {
    try {
      const response = await blogService.create({title, author, url})
      const newNotification = {
        msg: `A new blog ${title} by ${author} added`,
        typeAlert: 'success'
      }
      dispatch(toggleView(newNotification))
      dispatch(createBlog(response))
      blogToggleRef.current.toggle()
      setTimeout(() => {
        dispatch(toggleView({msg: '', typeAlert: ''}))
      }, 5000)
    }
    catch(error) {
      dispatch(toggleView({msg: error.response.data.error, typeAlert: 'error'}))
      setTimeout(() => {
        dispatch(toggleView({msg: '', typeAlert: ''}))
      }, 5000)
    }
  }

  const handleLike = async blog => {
    const blogToChange = blogsState.find(actualBlog => actualBlog.id === blog.id)
    const newBlog = {
      title: blogToChange.title,
      author: blogToChange.author,
      url: blogToChange.url,
      _id: blogToChange.id,
      user: blogToChange.user,
      likes: blogToChange.likes + 1
    }
    dispatch(plusLike(newBlog))
  }

  const handleDelete = async blogToRemove => {
    const confirm = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
    if (confirm) {
      try {
        await blogService.remove(blogToRemove.id)
        dispatch(setBlogs(blogsState.filter(blog => blog.id !== blogToRemove.id)))
      }
      catch(error) {
        dispatch(toggleView({msg: error.response.data.error, typeAlert: 'error'}))
        setTimeout(() => {
          dispatch(toggleView({msg: '', typeAlert: ''}))
        }, 5000)
      }
    }

  }

  if (user === null) {
    return(
      <div>
        <h1>log in to application</h1>
        <Notification/>
        <div>
          <form onSubmit={handleLogin}>
            <Input text="username" name="Username" actualValue={username} type="text" onChange={e => setUsername(e.target.value)} />
            <Input text="password" name="Password" actualValue={password} type="password" onChange={e => setPassword(e.target.value)} />
            <button type="submit">login</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification/>
      {user.username} logged in <button onClick={handleLogout}>logout</button>
      <div>
        <Togglable buttonLabel="create new blog" hideLabel="cancel" ref={blogToggleRef}>
          <AddBlogForm handleCreate={handleCreate} />
        </Togglable>
      </div>
      {blogsState.map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} userSession={user} />
      )}
    </div>
  )
}

export default App