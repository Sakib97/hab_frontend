import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import styles from '../../../css/Editor.module.css'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Button } from 'react-bootstrap';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import GradingIcon from '@mui/icons-material/Grading';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import GoToTopButton from '../../../components/GoToTopButton';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';

const Editor = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [broken, setBroken] = useState(window.matchMedia('(max-width:768px)').matches);

    const breadcrumbNameMap = {
        //     'editor_dashboard': {name: 'Editor Dashboard', icon: <BadgeTwoToneIcon/>} ,
        //     'notifications': {name: 'Notifications', icon: <NotificationsTwoToneIcon/>} ,
        //     'review': {name: 'Article Reviews', icon: <GradingIcon/>} ,
        //    'create_subcat_tag': {name: 'Create Subcategory & Tag', icon: <CategoryTwoToneIcon/>} ,
        //     'notes': {name: 'Write Notes', icon: <EditNoteTwoToneIcon/>} 

        'editor_dashboard': 'Editor Dashboard',
        'notifications': 'Notifications',
        'review': 'Article Reviews',
        'create_subcat_tag': 'Create Subcategory & Tag',
        'notes': 'Write Notes'

    };
    const location = useLocation();
    let currentLink = ''
    const pathArray = location.pathname.split('/').filter((crumb) => crumb !== '');
    const breadcrumbItems = [
        {
            key: 'home',
            title: <Link to="/"><HomeOutlined /></Link>,
        },
        ...pathArray.map((crum, index) => {
            currentLink += `/${crum}`;
            const crumbName = breadcrumbNameMap[crum] || crum;
            const isLast = index === pathArray.length - 1;

            return {
                key: index + 1,
                title: isLast ? crumbName : <Link to={currentLink}>{crumbName}</Link>
            };
        })
    ];


    // for hover effect on sidebar menue
    const defaultStyle = {
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
        <div className="editor" >
            <div className={`${styles.editorNav}`} >
                <Navbar sticky='top' className={`bg-body-tertiary ${styles.secNav}`} >
                    <Container>
                        <Button variant="light" onClick={() => setCollapsed(!collapsed)}>
                            {collapsed ? <MenuTwoToneIcon /> : <MenuOpenIcon />}
                        </Button>
                        &nbsp; &nbsp;
                        <Navbar.Brand>Editor Dashboard</Navbar.Brand>
                        <Navbar.Toggle />
                        <Navbar.Collapse className="justify-content-end">
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </div>

            <div style={{ display: 'flex', minHeight: '400px', marginTop: '50px' }}>
                <div className={`${styles.editorSidebar}`} >
                    {/* className={`${styles.editorMenu}`} */}
                    <Sidebar
                        // style={{position: "fixed"}}
                        // collapsedWidth="100px"
                        backgroundColor={broken ? "white" : "#f0f0f0"}
                        collapsed={collapsed}
                        toggled={broken && !collapsed}
                        customBreakPoint="768px"
                        onBreakPoint={setBroken}
                        onBackdropClick={broken ? () => setCollapsed(true) : ''}
                    >
                        <Menu>
                            {broken && <MenuItem disabled >Editor Menu</MenuItem>}
                            {/* {broken && <MenuItem style={{ marginBottom: "20px" }} disabled >Editor</MenuItem>} */}
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                icon={<BadgeTwoToneIcon />}>Editor Profile</MenuItem>
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                icon={<NotificationsTwoToneIcon />}>Notification</MenuItem>
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                component={<Link to="/editor_dashboard/review" />}
                                icon={<GradingIcon />}> Article Reviews</MenuItem>
                            <MenuItem style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                icon={<CategoryTwoToneIcon />}>Create Subcategory & <br /> Tag</MenuItem>
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                        </Menu>
                    </Sidebar>
                </div>

                <main style={{ padding: 0 }}>
                    <div className={`${styles.editorBreadcrumb}`} >
                         <Breadcrumb items={breadcrumbItems} />
                    </div>
                    <div style={{ marginTop: "25px", paddingTop: 10 }}>
                        <Outlet />
                    </div>
                    <GoToTopButton />
                </main>
            </div>
        </div>
    );
}

export default Editor;