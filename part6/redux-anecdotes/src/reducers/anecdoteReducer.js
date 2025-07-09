import { createSlice } from '@reduxjs/toolkit'
import anecdoteServices from '../services/anecdotes.js'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0
  }
}

const anecdoteSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    vote(state, action) {
      const newState = state.map(anecdote => anecdote.id === action.payload.id ? {...anecdote, votes: anecdote.votes + 1} : anecdote)
      return [...newState].sort((a,b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      return [...state, action.payload].sort((a,b) => b.votes - a.votes)
    },
    setAnecdotes(state, action) {
      return action.payload.sort((a,b) => b.votes - a.votes)
    }
  }
})

export const { vote, createAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer

export const initializeAnecdotes = () => {
  return async dispatch => {
    const result = await anecdoteServices.getAll()
    dispatch(setAnecdotes(result))
  }
}

export const addAnecdote = anecdote => {
  return async dispatch => {
    const result = await anecdoteServices.addAnecdote(anecdote)
    dispatch(createAnecdote(result))
  }
}

export const addVote = anecdote => {
  return async dispatch => {
    const result = await anecdoteServices.addVote(anecdote)
    dispatch(vote(result))
  }
}