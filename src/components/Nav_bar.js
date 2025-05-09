import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import styles from '../css/Nav_bar.module.css'
import { Link } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useAuth from '../hooks/useAuth';
import { Badge, Avatar } from '@mui/material';
import useProfileContext from '../hooks/useProfileContext';
// import Divider from '@mui/material/Divider';
// import { Divider, useMediaQuery, useTheme, createTheme } from '@mui/material';
import { Divider } from 'antd';
import { Padding } from '@mui/icons-material';
import SubNavBar from './SubNavBar';

const Nav_bar = () => {
    const { auth } = useAuth()
    const { profile } = useProfileContext()

    // const theme = useTheme();
    // const theme = createTheme({
    //     breakpoints: {
    //         values: {
    //             xs: 0,
    //             sm: 600,
    //             md: 990,
    //             lg: 1200,
    //             xl: 1536,
    //         },
    //     },
    // });

    // // This will return `true` on small devices (below "md" breakpoint)
    // const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
    // console.log("isSmallScreen:: ", isSmallScreen);

    return (
        <div>

            <Navbar
                style={{ Padding: '30px' }}
                // fixed="top" 
                expand="lg"
                className={`${styles.customNavbar}`} >
                <Container >
                    <Navbar.Brand href="/" className={styles.navbarBrandCustom} >
                        History & Beyond
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ms-auto">

                            <div className={styles.searchContainer}>
                                <div className={styles.searchBar}>
                                    <span className={styles.searchIcon}> <i className="fas fa-search" /></span>
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className={styles.searchInput}
                                    />
                                </div>
                            </div>

                            {/* <Divider style={{ color: "black" }} type="vertical" /> */}
                            {/* Vertical Divider */}
                            <div className={styles.verticalDivider}></div>

                            <Nav.Item className={styles.navLinkCustom}>
                                <Link to="/" className={`${styles.navLinkCustom} ml-2 nav-link`} > Home </Link>
                            </Nav.Item>

                            {!auth?.email &&
                                <Nav.Item className={styles.navLinkCustom} style={{ color: 'green' }}>
                                    <Link to="/auth/register" className={`${styles.navLinkCustom} ml-2 nav-link`}> Register </Link>
                                </Nav.Item>
                            }
                            {!auth?.email &&
                                <Nav.Item className={styles.navLinkCustom}>
                                    <Link to="/auth/login" className={`${styles.navLinkCustom} ml-2 nav-link`}> Login </Link>
                                </Nav.Item>
                            }

                            <div style={{ paddingRight: "15px" }} className={styles.dropdown}>
                                <Nav.Item className={styles.navLinkCustom}>
                                    <Nav.Link href="" className={`${styles.navLinkCustom} ml-2 nav-link`}>Profile <i className="fas fa-caret-down"></i>
                                    </Nav.Link>
                                </Nav.Item>
                                <div className={styles.dropdownContent}> 
                                    <Link to="/profile/account"> Profile </Link>
                                    <Link to="/sadmin_dashboard"> SAdmin Dashboard </Link>
                                    <Link to="/editor_dashboard"> Editor Dashboard </Link>

                                </div>
                            </div>
                            {/* &nspb; */}
                            {/* <Divider 
                             sx={{ borderColor: 'gray', 
                                padding: "10px", 
                                height: "30px", 
                                marginTop: '8px',
                            
                            }}  
                             orientation="vertical" 
                             flexItem /> */}
                            {/* <Divider
                                sx={{
                                    borderColor: 'gray',
                                    // paddingRight: "10px", 
                                    height: isSmallScreen ? 'auto' : '30px',  // auto height for horizontal on small devices, 30px for vertical on larger screens
                                    width: isSmallScreen ? '100%' : 'auto',   // full width for horizontal on small devices, auto for vertical on larger screens
                                    marginTop: '8px',
                                    borderWidth: { xs: '3px 0px 0px 0px', md: '0px 0px 0px 3px' }  // 1px border on top for horizontal, left border for vertical
                                }}
                                orientation={isSmallScreen ? 'horizontal' : 'vertical'}  // horizontal on small screens, vertical on large screens
                                flexItem
                            /> */}

                            {auth?.email &&
                                <Nav.Item className={styles.navLinkCustom}>
                                    <Link to="/profile/account" className="ml-2 nav-link">
                                        <Badge badgeContent={40} max={9} color="success">
                                            <Avatar
                                                sx={{ width: 30, height: 30 }}
                                                src={profile.image_url ? profile.image_url : 'https://i.ibb.co/YZnHSSd/avatar-2.jpg'}
                                            />
                                        </Badge>
                                    </Link>
                                </Nav.Item>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* <Breadcrums /> */}
<SubNavBar/>
        </div>

    );
}

export default Nav_bar;
