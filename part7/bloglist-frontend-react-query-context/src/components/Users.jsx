import { useContext, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAll } from '../services/users.js'
import { Table } from 'react-bootstrap'
import UserContext from '../UserContext.jsx'
import BlogsHeader from './BlogsHeader.jsx'
import { useNavigate, Link } from 'react-router-dom'

const Users = ({ handleLogout }) => {
    const [user] = useContext(UserContext)
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
    })

    const query = useQuery({
        queryKey: ['users'],
        queryFn: async () => await getAll(),
    })

    if (query.isLoading) {
        return <div>loading users...</div>
    }

    const users = query.data

    return (
        <div className="container">
            <BlogsHeader user={user} handleLogout={handleLogout} />
            <h2>Users</h2>
            <Table striped>
                <tbody>
                    <tr>
                        <td></td>
                        <td>
                            <strong>blogs created</strong>
                        </td>
                    </tr>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>
                                <Link to={`/users/${user.id}`}>
                                    {user.name}
                                </Link>
                            </td>
                            <td>{user.blogs.length}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Users
