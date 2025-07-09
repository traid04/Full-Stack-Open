import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useContext } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { getAll, newVote } from './requests.js'
import NotificationContext from './NotificationContext.jsx'

const App = () => {
  const queryClient = useQueryClient()
  const newVotesMutation = useMutation({
    mutationFn: newVote,
    onSuccess: (data, voted) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: true, msg: `anecdote '${voted.content}' voted`}})
      setTimeout(() => {
        dispatchNotification({type: 'SHOW_TOGGLE', payload: {show: false, msg: ''}})
      }, 5000)
    },
  })
  
  const [notification, dispatchNotification] = useContext(NotificationContext)

  const handleVote = (anecdote) => {
    newVotesMutation.mutate(anecdote)
  }

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAll,
    retry: 1
  })

  if (result.isLoading) {
    return (
      <div>
        loading data...
      </div>
    )
  }

  if (result.isError) {
    return (
      <div>
        anecdote service not available due to problems in server
      </div>
    )
  }

  const anecdotes = result.data

  return (
    <div>
      <h3>Anecdote app</h3>
      
      <Notification />
      <AnecdoteForm />
      
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
