import { useQueryClient, useMutation } from "@tanstack/react-query"
import { useState, useContext } from 'react'
import { createAnecdote } from "../requests.js"
import NotificationContext from "../NotificationContext.jsx"

const AnecdoteForm = () => {
  const [notification, dispatchNotification] = useContext(NotificationContext)
  const [lastCreated, setLastCreated] = useState('')

  const queryClient = useQueryClient()
  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: true, msg: `anecdote '${lastCreated}' created`}})
      setTimeout(() => {
        dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: false, msg: ''}})
      }, 5000)
    },
    onError: (error) => {
      dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: true, msg: `${error.response.data.error}`}})
      setTimeout(() => {
        dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: false, msg: ''}})
      }, 5000)
    }
  })
  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    newAnecdoteMutation.mutate({ content, votes: 0 })
    setLastCreated(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name='anecdote' />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
