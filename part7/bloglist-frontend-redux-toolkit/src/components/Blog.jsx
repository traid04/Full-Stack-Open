import { useState } from 'react'
import { useSelector } from 'react-redux'

const Blog = ({ blog, handleLike, handleDelete, userSession }) => {
  const [view, setView] = useState(false)
  const actualLikes = useSelector(state => {
    const actualBlog = state.blogs.find(b => b.id === blog.id)
    return actualBlog.likes
  })
  const blogStyle = {
    marginTop: 10,
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeStyle = {
    backgroundColor: '#1f8cc9',
    borderRadius: '10px'
  }

  return (
    <div style={blogStyle} className='blog-simple'>
      {blog.title} {blog.author} <button onClick={() => setView(!view)}>{view ? 'hide' : 'view'}</button>
      {view &&
        <div className='blog-details'>
          <p>{blog.url}</p>
          <p>likes {actualLikes} <button onClick={() => handleLike(blog)}>like</button></p>
          <p>{blog.user.name}</p>
          {userSession.name === blog.user.name && <button style={removeStyle} onClick={() => handleDelete(blog)}>remove</button>}
        </div>
      }
    </div>
  )}

export default Blog