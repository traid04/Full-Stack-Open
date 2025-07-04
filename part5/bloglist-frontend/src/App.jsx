import { useState, useEffect, useRef } from 'react'
import './index.css'
import Blog from './components/Blog'
import AddBlogForm from './components/AddBlogForm'
import Input from './components/Input'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [typeAlert, setTypeAlert] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  const blogToggleRef = useRef()
  const blogComponentRef = useRef()

  useEffect(() => {
    if (user) {
      blogService.setToken(user.token)
      blogService.getAll().then(blogs =>
        setBlogs( blogs )
      )
    }
  }, [user])

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])
  const handleLogin = async e => {
    e.preventDefault()
    try {
      const response = await loginService.login({ username, password })
      setUser(response)
      setUsername('')
      setPassword('')
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(response))
    }
    catch(error) {
      setTypeAlert('error')
      setAlertMessage(error.response.data.error)
      setTimeout(() => {
        setTypeAlert('')
        setAlertMessage('')
      }, 5000)
    }
  }

  const handleLogout = e => {
    e.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleCreate = async ({title, author, url}) => {
    try {
      const response = await blogService.create({title, author, url})
      setAlertMessage(`A new blog ${title} by ${author} added`)
      setTypeAlert('success')
      setBlogs(blogs.concat(response))
      blogToggleRef.current.toggle()
      setTimeout(() => {
        setTypeAlert('')
        setAlertMessage('')
      }, 5000)
    }
    catch(error) {
      setTypeAlert('error')
      setAlertMessage(error.response.data.error)
      setTimeout(() => {
        setTypeAlert('')
        setAlertMessage('')
      }, 5000)
    }
  }

  const handleLike = async blog => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      _id: blog.id,
      user: blog.user,
      likes: blogComponentRef.current.actualLikes + 1
    }
    try {
      const response = await blogService.update(newBlog)
      blogComponentRef.current.setActualLikes(response.likes)
    }
    catch(error) {
      console.log(error)
    }
  }

  const handleDelete = async blogToRemove => {
    const confirm = window.confirm(`Remove blog ${blogToRemove.title} by ${blogToRemove.author}`)
    if (confirm) {
      try {
        await blogService.remove(blogToRemove.id)
        setBlogs(blogs.filter(blog => blog.id !== blogToRemove.id))
      }
      catch(error) {
        setTypeAlert('error')
        setAlertMessage(error.response.data.error)
        setTimeout(() => {
          setTypeAlert('')
          setAlertMessage('')
        }, 5000)
      }
    }

  }

  if (user === null) {
    return(
      <div>
        <h1>log in to application</h1>
        <Notification message={alertMessage} typeAlert={typeAlert} />
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
      <Notification message={alertMessage} typeAlert={typeAlert} />
      {user.username} logged in <button onClick={handleLogout}>logout</button>
      <div>
        <Togglable buttonLabel="create new blog" hideLabel="cancel" ref={blogToggleRef}>
          <AddBlogForm handleCreate={handleCreate} />
        </Togglable>
      </div>
      {blogs.sort((a,b) => b.likes - a.likes).map(blog =>
        <Blog key={blog.id} blog={blog} handleLike={handleLike} handleDelete={handleDelete} userSession={user} ref={blogComponentRef}/>
      )}
    </div>
  )
}

export default App