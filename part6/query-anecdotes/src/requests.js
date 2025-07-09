import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAll = async () => {
    const result = await axios.get(baseUrl).then(res => res.data)
    return result
}

export const createAnecdote = async anecdote => {
    const result = await axios.post(baseUrl, anecdote)
    return result
}

export const newVote = async anecdote => {
    const newAnecdote = {...anecdote, votes: anecdote.votes + 1}
    const result = await axios.put(`${baseUrl}/${anecdote.id}`, newAnecdote)
    return result
}