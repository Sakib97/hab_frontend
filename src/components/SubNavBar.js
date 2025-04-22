import React, { useState, useEffect } from 'react';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import styles from '../css/SubNavBar.module.css'
import axios from "../api/axios";
import { useQuery } from "react-query";
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { fetchData } from '../utils/getDataUtil';

const SubNavBar = () => {
    const GET_MENU_URL = '/api/v1/category/get_all_cat'

    const [toggled, setToggled] = React.useState(false);

    const axiosInst = axios;
    const { data: catData, error: catError, isLoading: catLoading } = useQuery(
        ['menuData', GET_MENU_URL],
        () => fetchData(GET_MENU_URL, axiosInst),
        {
            staleTime: 60,  // Example option: Cache data for 6 seconds
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );


    const mainCategories = [
        { name: 'Latest', path: '/category/latest' },
        { name: 'Early Islamic Age', path: '/category/early-islamic-age' },
        { name: 'Bangladesh', path: '/category/bangladesh' },
        { name: 'Middle East', path: '/category/middle-east' },
        { name: 'Opinions', path: '/category/opinions' },
    ];

    const [allCategories, setAllCategories] = useState([]);
    useEffect(() => {
        if (catData) {
            const mappedCategories = catData.map(category => ({
                name: category.category_name,
                path: `/category/${category.category_slug}`
            }));
            setAllCategories(mappedCategories);
        }

    }, [catData]);

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


                <Sidebar
                    className={`${styles.sideBar}`}
                    onBackdropClick={() => setToggled(false)}
                    // collapsed={toggled}
                    toggled={toggled}
                    breakPoint="all"
                    backgroundColor="#3c3c3c"
                    rootStyles={{
                        color: '#fff',
                    }}
                    width="200px"
                    rtl
                >
                    <Menu >
                        {catLoading ? <div>Loading...</div> :
                            catError ? <div>Server Error!</div> :
                                allCategories.map((category, index) => (
                                    <MenuItem key={index}
                                        style={defaultStyle}
                                        onMouseEnter={handleMouseEnter}
                                        onMouseLeave={handleMouseLeave}
                                        component={<Link to={category.path} />}
                                    >
                                        <span style={{
                                            color: '#fff',
                                            textDecoration: 'none'
                                        }} className={`${styles.sideBarLink}`}> 
                                        {category.name} 
                                        </span>

                                    </MenuItem>
                                ))}
                    </Menu>
                </Sidebar>


            </Container>

        </div>
    );
}

export default SubNavBar;