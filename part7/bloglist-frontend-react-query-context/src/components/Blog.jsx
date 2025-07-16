import { Link } from 'react-router-dom'

const Blog = ({ blog }) => {
    return (
        <tr>
            <td>
                <Link to={`/blogs/${blog.id}`} className="text-decoration-none">
                    {blog.title}
                </Link>
            </td>
            <td>{blog.author}</td>
        </tr>
    )
}

export default Blog
