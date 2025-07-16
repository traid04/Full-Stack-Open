import { Link } from 'react-router-dom'
import { Button, Navbar, Nav } from 'react-bootstrap'

const BlogsHeader = ({ user, handleLogout }) => {
    return (
        <div className="container">
            <Navbar
                className="px-3"
                collapseOnSelect
                expand="lg"
                bg="dark"
                variant="dark"
            >
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">
                            home
                        </Nav.Link>
                        <Nav.Link as={Link} to="/users">
                            users
                        </Nav.Link>
                    </Nav>
                    {user === null ? (
                        <Nav.Link className="text-primary" as={Link} to="/">
                            login
                        </Nav.Link>
                    ) : (
                        <span className="text-light">
                            {user.name} logged in{' '}
                            <Button
                                className="m-2"
                                variant="danger"
                                size="sm"
                                onClick={handleLogout}
                            >
                                logout
                            </Button>
                        </span>
                    )}
                </Navbar.Collapse>
            </Navbar>
        </div>
    )
}

export default BlogsHeader
