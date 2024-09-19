import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import styles from '../css/Nav_bar.module.css'
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useAuth from '../hooks/useAuth';

const Nav_bar = () => {
    const { auth } = useAuth()

    return (
        <div>

            <Navbar sticky="top" bg="dark" variant="dark" expand="lg" className={`${styles.customNavbar} bg-body-tertiary`} >
                <Container >
                    <Navbar.Brand href="/" className={styles.navbarBrandCustom}>History & Beyond</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">
                            <Nav.Item>
                                <Link to="/" className="ml-2 nav-link"> Home </Link>
                            </Nav.Item>
                            {auth?.email &&
                                <Nav.Item>
                                    <Link to="/profile/account" className="ml-2 nav-link"> Profile </Link>
                                </Nav.Item>
                            }

                            {!auth?.email &&
                                <Nav.Item>
                                    <Link to="/auth/register" className="ml-2 nav-link"> Register </Link>
                                </Nav.Item>
                            }
                            {!auth?.email &&
                                <Nav.Item>
                                    <Link to="/auth/login" className="ml-2 nav-link"> Login </Link>
                                </Nav.Item>
                            }

                            <div className={styles.dropdown}>
                                <Nav.Item>
                                    <Nav.Link href="">Dropdown <i className="fas fa-caret-down"></i>
                                    </Nav.Link>
                                </Nav.Item>
                                <div className={styles.dropdownContent}>
                                    <Link to="/profile/account"> Profile </Link>
                                    <Link to="/sadmin_dashboard"> SAdmin Dashboard </Link>
                                    <Link to="/editor_dashboard"> Editor Dashboard </Link>

                                </div>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* <Breadcrums /> */}

        </div>

    );
}

export default Nav_bar;
