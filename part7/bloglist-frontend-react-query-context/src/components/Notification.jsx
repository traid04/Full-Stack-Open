import { Alert } from 'react-bootstrap'

const Notification = ({ message, typeAlert }) => {
    if (typeAlert !== '') {
        return <Alert variant={typeAlert}>{message}</Alert>
    }
}

export default Notification
