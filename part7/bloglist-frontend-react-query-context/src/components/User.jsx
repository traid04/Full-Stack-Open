import { useContext } from 'react'
import { useMatch } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/users.js'
import { Table } from 'react-bootstrap'
import BlogsHeader from './BlogsHeader.jsx'
import UserContext from '../UserContext.jsx'

const User = ({ handleLogout }) => {
    const [user] = useContext(UserContext)
    let id
    const match = useMatch('/users/:id')
    if (match) {
        id = match.params.id
    }
    const result = useQuery({
        queryKey: ['users'],
        queryFn: async () => await getAll(),
    })
    if (result.isLoading) {
        return <div>loading user...</div>
    }
    const users = result.data
    const userToRender = users.find((user) => user.id === id)
    if (!userToRender) {
        return null
    }
    return (
        <div className="container">
            <BlogsHeader user={user} handleLogout={handleLogout} />
            <h1>{userToRender.name}</h1>
            <h2>added blogs</h2>
            <Table striped>
                <tbody>
                    {userToRender.blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>{blog.title}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default User
