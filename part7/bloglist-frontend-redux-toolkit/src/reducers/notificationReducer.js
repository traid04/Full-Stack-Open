import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    msg: '',
    typeAlert: ''
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        toggleView(state, action) {
            const newState = {
                msg: action.payload.msg,
                typeAlert: action.payload.typeAlert
            }
            return newState
        }
    }
})

export const { toggleView } = notificationSlice.actions
export default notificationSlice.reducer