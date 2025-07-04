import { useState } from 'react'
import Input from './Input'

const AddBlogForm = ({ handleCreate }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    handleCreate({title, author, url})
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return(
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmit}>
        <Input text="title: " name="title" actualValue={title} type="text" onChange={e => setTitle(e.target.value)} />
        <Input text="author: " name="author" actualValue={author} type="text" onChange={e => setAuthor(e.target.value)} />
        <Input text="url: " name="url" actualValue={url} type="text" onChange={e => setUrl(e.target.value)} />
        <div>
          <button type="submit">create</button>
        </div>
      </form>
    </div>
  )
}

AddBlogForm.displayName = 'AddBlogForm'

export default AddBlogForm