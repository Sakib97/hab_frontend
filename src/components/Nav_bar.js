import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import styles from '../css/Nav_bar.module.css'
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import useAuth from '../hooks/useAuth';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import useProfileContext from '../hooks/useProfileContext';
// import Divider from '@mui/material/Divider';
// import { Divider, useMediaQuery, useTheme, createTheme } from '@mui/material';
import { Divider } from 'antd';
import { Padding } from '@mui/icons-material';
import SubNavBar from './SubNavBar';
import { useEffect, useState } from 'react';
import dashboardImage from '../assets/dashboard3.jpg';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { fetchData } from '../utils/getDataUtil';
import { useQuery } from 'react-query';
import { Badge, Avatar } from 'antd';
import { getFormattedTime } from '../utils/dateUtils';

const Nav_bar = () => {
    const { auth } = useAuth()
    const { profile } = useProfileContext()
    // console.log("auth:: ", auth.email);


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

    ///////// if auth, get notification count ///////////////////
    const GET_UNREAD_UNCLICKED_NOTIFICATION_COUNT_URL = `/api/v1/notification/get_all_unread_unclicked_notis_count`;
    const [notisApiResponse, setNotisApiResponse] = useState();

    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;
    const location = useLocation();


    const { data: totalUnreadUnclickedData, error: totalUnreadUnclickedError,
        isLoading: totalUnreadUnclickedLoading, refetch } = useQuery(
            ['totalUnreadUnclickedData', GET_UNREAD_UNCLICKED_NOTIFICATION_COUNT_URL],
            () => fetchData(GET_UNREAD_UNCLICKED_NOTIFICATION_COUNT_URL, axiosInst),
            {
                // The double exclamation mark !! is a JavaScript trick to convert any value into a boolean
                enabled: !!auth?.email, // Only run this query if auth.email is available
                refetchOnWindowFocus: true,
                refetchOnMount: true,
                onSuccess: (data) => {
                    setNotisApiResponse(data);
                }
            }
        );
    useEffect(() => {
        // Refetch notifications when location changes or button is clicked
        if (auth?.email) {
            // Only refetch if the user is logged in
            refetch();
        }
    }, [location, auth?.email])
/////// for notification count////////////

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
                                    <span className={styles.searchIcon}>
                                        <i className="fas fa-search" /></span>
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

                            {/* <div style={{ paddingRight: "15px" }} className={styles.dropdown}>
                                <Nav.Item className={styles.navLinkCustom}>
                                    <Nav.Link href="" className={`${styles.navLinkCustom} ml-2 nav-link`}>Profile <i className="fas fa-caret-down"></i>
                                    </Nav.Link>
                                </Nav.Item>
                                <div className={styles.dropdownContent}>
                                    <Link to="/profile/account"> Profile </Link>
                                    <Link to="/sadmin_dashboard"> SAdmin Dashboard </Link>
                                    <Link to="/editor_dashboard"> Editor Dashboard </Link>
                                </div>
                            </div> */}
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
                                <div style={{ paddingRight: "15px" }} className={styles.dropdown}>
                                    <Nav.Item className={styles.navLinkCustom}>
                                        {/* <Link to="/profile/account" className="ml-2 nav-link"> */}
                                            <Badge count={notisApiResponse?.combinedNotisCount}
                                                overflowCount={9} style={{ fontSize: '10px' }}
                                                color='#f5222d'>
                                                <Avatar
                                                    // sx={{ width: 30, height: 30 }}
                                                    style={{cursor: 'pointer'}}
                                                    shape="circle" size={30}
                                                    src={profile.image_url ? profile.image_url : 'https://i.ibb.co/YZnHSSd/avatar-2.jpg'}
                                                />
                                            </Badge>
                                        {/* </Link> */}
                                    </Nav.Item>
                                    <div className={styles.dropdownContent}>
                                        <Link to="/profile/account">
                                            <div style={{ display: 'flex' }}>
                                                <i style={{ fontSize: '22px' }} className="fi fi-rs-circle-user"></i>
                                                &nbsp;
                                                {profile?.first_name} {profile?.last_name}
                                            </div>
                                        </Link>

                                        <Link to="/profile/notification">
                                            <div>
                                                <div style={{ display: 'flex' }}>
                                                    <Badge count={notisApiResponse?.userAuthorNotisCount}
                                                        overflowCount={9}
                                                        style={{ fontSize: '10px' }}
                                                        color='#f5222d'>
                                                        <i style={{ fontSize: '22px', color: 'white' }}
                                                            className="fa-regular fa-bell"></i>
                                                    </Badge>
                                                    &nbsp; &nbsp;
                                                    <div> Profile Notification</div>
                                                </div>
                                                {notisApiResponse?.userAuthorNotisCount > 0 &&
                                                    <div style={{
                                                        fontSize: '13px', color: '#D0D0D0', paddingLeft: '30px',
                                                        borderTop: '1px solid #D0D0D0'
                                                    }}>
                                                        <FiberNewIcon style={{ color: 'white', fontSize: '25px' }} />
                                                        &nbsp;
                                                        {notisApiResponse?.userAuthorLatestNotis?.notification_title}
                                                        <br />
                                                        <span style={{ fontSize: '11px' }}>
                                                            <i className="fa-regular fa-clock"></i>  &nbsp;
                                                            {getFormattedTime(notisApiResponse?.userAuthorLatestNotis?.notification_time)}
                                                        </span>
                                                    </div>
                                                }
                                            </div>
                                        </Link>

                                        {auth?.roles.includes(1260) &&
                                            <Link to="/editor_dashboard/notification">
                                                <div>
                                                    <div style={{ display: 'flex' }}>
                                                        <Badge count={notisApiResponse?.editorNotisCount}
                                                            overflowCount={9}
                                                            style={{ fontSize: '10px' }}
                                                            color='#f5222d'>
                                                            <i style={{ fontSize: '22px', color: 'white' }} className="fa-regular fa-bell"></i>
                                                        </Badge>
                                                        &nbsp; &nbsp;
                                                        <div> Editor Notification</div>

                                                    </div>
                                                    {notisApiResponse?.editorNotisCount > 0 &&
                                                        <div style={{
                                                            fontSize: '13px', color: '#D0D0D0', paddingLeft: '30px',
                                                            borderTop: '1px solid #D0D0D0'
                                                        }}>
                                                            <FiberNewIcon style={{ color: 'white', fontSize: '25px' }} />
                                                            &nbsp;
                                                            {notisApiResponse?.editorLatestNotis?.notification_title}
                                                            <br />
                                                            <span style={{ fontSize: '11px' }}>
                                                                <i className="fa-regular fa-clock"></i>  &nbsp;
                                                                {getFormattedTime(notisApiResponse?.editorLatestNotis?.notification_time)}
                                                            </span>
                                                        </div>
                                                    }
                                                </div>
                                            </Link>}



                                        {auth?.roles.includes(1260) &&
                                            <div>
                                                <Link to="/editor_dashboard">
                                                    <div style={{ display: 'flex' }}>
                                                        <i style={{ fontSize: '22px' }} className="fi fi-rr-dashboard-monitor"></i>
                                                        &nbsp;
                                                        Editor
                                                    </div>
                                                </Link>
                                            </div>
                                        }
                                        {auth?.roles.includes(1453) &&
                                            <Link to="/sadmin_dashboard">
                                                <div style={{ display: 'flex' }}>
                                                    <i style={{ fontSize: '22px' }} class="fi fi-rs-admin-alt"></i>
                                                    &nbsp;
                                                    SAdmin
                                                </div>
                                            </Link>}
                                    </div>
                                </div>
                            }
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar >

            {/* <Breadcrums /> */}
            < SubNavBar />
        </div >

    );
}

export default Nav_bar;
