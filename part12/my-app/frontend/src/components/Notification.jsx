import { useSelector } from 'react-redux'

const Notification = () => {
  const notificationState = useSelector(state => state.notification)
  if (notificationState.typeAlert !== '') {
    return (
      <div className={notificationState.typeAlert}>{notificationState.msg}</div>
    )
  }
}

export default Notification