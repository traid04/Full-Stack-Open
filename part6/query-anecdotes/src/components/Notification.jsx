import NotificationContext from '../NotificationContext.jsx'
import { useContext } from 'react'

const Notification = () => {
  const [notification, dispatchNotification] =  useContext(NotificationContext)
  const { msg, show } = notification
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    show ? <div style={style}>{msg}</div> : <></>
  )
}

export default Notification
