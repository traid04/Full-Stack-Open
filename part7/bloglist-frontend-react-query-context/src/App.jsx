import { useState, useEffect, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import './index.css'
import Users from './components/Users.jsx'
import Home from './components/Home.jsx'
import User from './components/User.jsx'
import IndividualBlogView from './components/IndividualBlogView.jsx'
import UserContext from './UserContext'

const App = () => {
    const [user, userDispatch] = useContext(UserContext)
    const [loadingUser, setLoadingUser] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        const loggedUser = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUser) {
            userDispatch({ type: 'SET_USER', payload: JSON.parse(loggedUser) })
        }
        setLoadingUser(false)
    }, [])

    const handleLogout = (e) => {
        e.preventDefault()
        userDispatch({ type: 'SET_USER', payload: null })
        window.localStorage.removeItem('loggedBlogappUser')
        navigate('/')
    }

    if (loadingUser) {
        return <div>loading...</div>
    }

    return (
        <Routes>
            <Route path="/" element={<Home handleLogout={handleLogout} />} />
            <Route
                path="/users"
                element={<Users handleLogout={handleLogout} />}
            />
            <Route
                path="/users/:id"
                element={<User handleLogout={handleLogout} />}
            />
            <Route
                path="/blogs/:id"
                element={<IndividualBlogView handleLogout={handleLogout} />}
            />
        </Routes>
    )
}

export default App
