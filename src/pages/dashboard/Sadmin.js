import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { Nav, NavDropdown, Button } from 'react-bootstrap';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';

import styles from '../../css/Editor.module.css'
const Sadmin = () => {

    const [isSidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return ( 
        <div className="Sadmin">
            <Navbar className= {`bg-body-tertiary ${styles.secNav}`} >
                <Container>
                    <Button variant="light" id="sidebarToggle" onClick={toggleSidebar}>
                        <i className="fa-solid fa-bars"></i>
                    </Button> &nbsp; &nbsp;
                    <Navbar.Brand>Super Admin Dashboard</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* <br /> */}

            <div className="d-flex" id="wrapper">
                {/* Sidebar */}
                <div
                    className={`border-end bg-white ${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}
                    id="sidebar-wrapper"
                >
                    {/* <div className="sidebar-heading border-bottom bg-light p-3">SAdmin Dashboard</div> */}
                    <div className="list-group list-group-flush">
                        <a className="list-group-item list-group-item-action list-group-item-dark p-3" href="#!">Dashboard</a>
                        <a className="list-group-item list-group-item-action list-group-item-light p-3" href="#!">Shortcuts</a>
                        {/* <a className={`list-group-item list-group-item-action list-group-item-light p-3`} href="#!"> <div className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : styles.sidebarClosed}`}>Shortcuts</div></a> */}
                    </div>
                    {/* <ListGroup>
                        <ListGroup.Item variant="dark">Dark</ListGroup.Item>
                        <ListGroup.Item variant="dark">Dark</ListGroup.Item>
                    </ListGroup> */}
                </div>

                {/* Page Content */}
                <div id="page-content-wrapper" className={`${styles.pageContent} `}>
                    {/* Top Navigation */}
                    {/* <Navbar bg="light" expand="lg" className="border-bottom">
                        <Container fluid>
                            <Button variant="light" id="sidebarToggle" onClick={toggleSidebar}>
                                <i class="fa-solid fa-bars"></i>
                            </Button>
                        </Container>
                    </Navbar> */}

                    {/* Page Content */}
                    <Container>
                        <h1 className="mt-4">Simple Sidebar</h1>
                        <p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p>
                        <p>
                            Make sure to keep all page content within the
                            <code>#page-content-wrapper</code>. The top navbar is optional, and just for demonstration.
                        </p>
                        <p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p>
                        <p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p>
                        <p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p><p>
                            The starting state of the menu will appear collapsed on smaller screens, and will appear non-collapsed on larger screens.
                            When toggled using the button below, the menu will change.
                        </p>
                    </Container>
                </div>
            </div>

            {/* <h1>This is Super Admin Page !</h1> */}
        </div>
     );
}
 
export default Sadmin;

