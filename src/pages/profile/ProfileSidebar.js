import { useState } from 'react';
import useAuth from "../../hooks/useAuth";

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import {
    faUser, faBookBookmark, faComments, faRightFromBracket, faNewspaper,
    faBell, faCircleChevronLeft, faCircleChevronRight, faFilePen
}
    from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

import styles from '../../css/Profile.module.css'
import logo2 from '../../assets/logo4.png'
import useLogout from "../../hooks/useLogout";
import { Link } from 'react-router-dom';


const ProfileSidebar = ({ setSidebarExpanded }) => {
    const { auth, setAuth } = useAuth()

    const [collapsed, setCollapsed] = useState(true);
    const logout = useLogout();
    const [isExpanded, setIsExpanded] = useState(false);

    // for hover effect on sidebar menue
    const defaultStyle = {
        borderRadius: "10px",
        margin: "0 4px 0 5px",
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
    };
    const handleMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = "#CBCBCB"; // hover background color
    };
    const handleMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = "transparent"; // reset background color
    };

    return (
        <div className={styles.sidebarContainer} >
            <Sidebar collapsed={collapsed}>
                <Menu >
                    <MenuItem icon={
                        <img src={logo2} alt="Logo" style={{ width: '50px', borderRadius: '50%' }} />
                    }>
                        <FontAwesomeIcon
                            onClick={() => {
                                setCollapsed(true); setSidebarExpanded(false);
                            }}
                            style={{ width: '160px', marginLeft: '60px', fontSize: '20px' }}
                            icon={faCircleChevronLeft} />

                    </MenuItem>
                    <hr />

                    <MenuItem
                        style={defaultStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        component={<Link to="/profile/account" />}
                        icon={<FontAwesomeIcon icon={faUser} />}>
                        My Account</MenuItem>
                    <MenuItem
                        style={defaultStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        component={<Link to="/profile/notification" />}
                        icon={<FontAwesomeIcon icon={faBell} />}>
                        Notifications</MenuItem>
                    <MenuItem
                        style={defaultStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        icon={<FontAwesomeIcon icon={faBookBookmark} />}> Bookmarks</MenuItem>
                    <MenuItem
                        style={defaultStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        icon={<FontAwesomeIcon icon={faComments} />}> My Comments </MenuItem>


                    {(auth?.roles?.includes(1260) || auth?.roles?.includes(1203)) &&
                        <MenuItem
                            style={defaultStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            icon={<FontAwesomeIcon icon={faNewspaper} />}>
                            My Articles
                        </MenuItem>}

                    {(auth?.roles?.includes(1260) || auth?.roles?.includes(1203)) &&
                        <MenuItem
                            style={defaultStyle}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                            component={<Link to="/profile/write" />}
                            icon={<FontAwesomeIcon icon={faFilePen} />}>
                            Write Article
                        </MenuItem>}

                    <hr />
                    <br /><br /><br />

                    {collapsed &&
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                onClick={() => {
                                    setCollapsed(false); setSidebarExpanded(true);
                                }}
                                className="btn btn-light">
                                <FontAwesomeIcon
                                    style={{ fontSize: '20px' }}
                                    icon={faCircleChevronRight} />
                            </button>
                        </div>}
                    <br />
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <OverlayTrigger placement="right" overlay={
                            <Tooltip id="button-tooltip">Log Out</Tooltip>}>

                            <button onClick={logout} className="btn btn-light">
                                <FontAwesomeIcon icon={faRightFromBracket} />
                            </button>
                        </OverlayTrigger>

                    </div>

                </Menu>
            </Sidebar>
            <main style={{ padding: 1 }}>
                <div>
                    {/* <button className="sb-button" onClick={() => setIsExpanded(!isExpanded)}>
                        Toggle
                    </button> */}
                </div>
            </main>
        </div>



    );
}

export default ProfileSidebar;