import React, { useState, useRef } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../css/SubNavBar.module.css'
// import { slide as Menu } from 'react-burger-menu';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

const SubNavBar = () => {
    const [toggled, setToggled] = React.useState(false);

    const mainCategories = [
        { name: 'Latest', path: '/categories/latest' },
        { name: 'Early Islamic Age', path: '/categories/early-islamic-age' },
        { name: 'Bangladesh', path: '/categories/bangladesh' },
        { name: 'Middle East', path: '/categories/middle-east' },
        { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'Opinions', path: '/categories/opinions' },
        // { name: 'All Categories...', path: '/categories/all' },
    ];

    // Full list of categories for the burger menu
    const allCategories = [
        { name: 'Early Islamic Age', path: '/categories/early-islamic-age' },
        { name: 'Bangladesh', path: '/categories/bangladesh' },
        { name: 'Middle East', path: '/categories/middle-east' },
        { name: 'Opinions', path: '/categories/opinions' },
        { name: 'Ancient History', path: '/categories/ancient-history' },
        { name: 'Medieval Europe', path: '/categories/medieval-europe' },
        { name: 'World War II', path: '/categories/world-war-ii' },
        // Add more categories as needed
    ];

    // for hover effect on sidebar menue
    const defaultStyle = {
        borderRadius: "10px",
        marginTop: "4px",
        marginLeft: "5px",
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
    };
    const handleMouseEnter = (e) => {
        e.currentTarget.style.backgroundColor = "#605f5f"; // hover background color
    };
    const handleMouseLeave = (e) => {
        e.currentTarget.style.backgroundColor = "transparent"; // reset background color
    };

    return (
        <div className={styles.subNavbar}>
            <Container>
                <div 
                // className={`${styles.scrollableDiv}`}
                // className={`${styles.navScrollSection}`}
                >
                    <Nav
                        className={`${styles.navScrollItems} ${styles.scrollableDiv} `}
                    >
                        {mainCategories.map((category, index) => (
                            <Nav.Item key={index} className={`${styles.item}`}>
                                <Link to={category.path}
                                    className={`${styles.subNavLink} `}>
                                    {category.name}
                                </Link>
                            </Nav.Item>
                        ))}

                        <Nav.Item className={`${styles.item}`}>
                            <button
                                className={`${styles.subNavLink} sb-button`}
                                onClick={() => setToggled(!toggled)}
                                style={{
                                    border: 'none',
                                    background: 'none',
                                    padding: 0,
                                    cursor: 'pointer'
                                }}
                            >
                                All Categories...
                            </button>
                        </Nav.Item>
                    </Nav>
                </div>
                {/* <div className={`${styles.scrollableDiv}`}>
                    <div className={`${styles.item}`}>Item 1</div>
                    <div className={`${styles.item}`}>Item 2</div>
                    <div className={`${styles.item}`}>Item 3</div>
                    <div className={`${styles.item}`}>Item 4</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                    <div className={`${styles.item}`}>Item 5</div>
                </div> */}


                <Sidebar
                    className={`${styles.sideBar}`}
                    onBackdropClick={() => setToggled(false)}
                    // collapsed={toggled}
                    toggled={toggled}
                    breakPoint="always"
                    backgroundColor="#3c3c3c"
                    rootStyles={{
                        color: '#fff',
                    }}
                    width="200px"
                    rtl
                >
                    <Menu >
                        {allCategories.map((category, index) => (
                            <MenuItem key={index}
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}>
                                <Link
                                    to={category.path}
                                    style={{
                                        color: '#fff',
                                        textDecoration: 'none'
                                    }}
                                    className={`${styles.sideBarLink}`}
                                >
                                    {category.name}
                                </Link>
                            </MenuItem>
                        ))}
                    </Menu>
                </Sidebar>


            </Container>

        </div>
    );
}

export default SubNavBar;