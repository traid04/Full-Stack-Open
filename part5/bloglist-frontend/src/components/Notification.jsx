const Notification = ({ message, typeAlert }) => {
  if (typeAlert !== '') {
    return (
      <div className={typeAlert}>{message}</div>
    )
  }
}

export default Notification