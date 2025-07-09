import { useDispatch } from 'react-redux'
import { addAnecdote } from '../reducers/anecdoteReducer.js'
import { setNotification } from '../reducers/notificationReducer.js'

const AnecdoteForm = () => {
    const dispatch = useDispatch()
    
    const handleSubmit = async e => {
        e.preventDefault()
        dispatch(addAnecdote(e.target.anecdote.value))
        dispatch(setNotification(`you added '${e.target.anecdote.value}'`, 5))
        e.target.anecdote.value = ''
    }

    return (
    <>
        <h2>create new</h2>
        <form onSubmit={handleSubmit}>
        <div><input name='anecdote'/></div>
        <button type='submit'>create</button>
        </form>
    </>
    )

}

export default AnecdoteForm