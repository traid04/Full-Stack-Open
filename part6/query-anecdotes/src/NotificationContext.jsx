import { createContext, useReducer } from 'react'

const notificationReducer = (state, action) => {
    switch(action.type) {
        case 'SHOW_TOGGLE': {
            return action.payload
        }
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
    const [notification, dispatchNotification] = useReducer(notificationReducer, {show: false, msg: ''})

    return (
        <NotificationContext.Provider value={[notification, dispatchNotification]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext