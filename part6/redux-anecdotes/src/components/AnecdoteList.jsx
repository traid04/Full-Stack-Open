import { useSelector, useDispatch } from 'react-redux'
import { addVote } from '../reducers/anecdoteReducer.js'
import { setNotification } from '../reducers/notificationReducer.js'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => {
        if (state.filter === '') {
            return state.anecdotes
        }
        else {
            return state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
        }
    })

    const handleVote = (id) => {
        const anecdote = anecdotes.find(anecdote => anecdote.id === id)
        dispatch(addVote(anecdote))
        dispatch(setNotification(`You voted '${anecdote.content}'`, 5))
    }
    return (
        <>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                <div>
                    {anecdote.content}
                </div>
                <div>
                    has {anecdote.votes}
                    <button onClick={() => handleVote(anecdote.id)}>vote</button>
                </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList