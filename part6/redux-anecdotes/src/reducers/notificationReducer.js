import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    message: '',
    show: false
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        showToggle(state, action) {
            state.show = action.payload
        },
        setMessage(state, action) {
            state.message = action.payload
        }
    }
})

export const { showToggle, setMessage } = notificationSlice.actions
export default notificationSlice.reducer

export const setNotification = (message, time) => {
    return dispatch => {
        dispatch(setMessage(message))
        dispatch(showToggle(true))
        setTimeout(() => {
            dispatch(showToggle(false))
        }, time*1000)
    }
}