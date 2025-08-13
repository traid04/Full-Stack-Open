import ReactDOM from 'react-dom/client'
import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'
import App from './App'

import notificationReducer from './reducers/notificationReducer.js'
import blogsReducer from './reducers/BlogsReducer.js'
import userReducer from './reducers/userReducer.js'

const store = configureStore({
    reducer: {
        notification: notificationReducer,
        blogs: blogsReducer,
        user: userReducer
    }
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <App />
    </Provider>
)