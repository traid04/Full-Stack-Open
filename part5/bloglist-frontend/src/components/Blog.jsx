import { useState, forwardRef, useImperativeHandle } from 'react'

const Blog = forwardRef(({ blog, handleLike, handleDelete, userSession }, refs) => {
  const [view, setView] = useState(false)
  const [actualLikes, setActualLikes] = useState(blog.likes)
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

  useImperativeHandle(refs, () => {
    return {
      actualLikes, setActualLikes
    }
  })

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
  )})

export default Blog