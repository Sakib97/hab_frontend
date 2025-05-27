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
import { Breadcrumb, Badge } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import GoToTopButton from '../../../components/GoToTopButton';
import BadgeTwoToneIcon from '@mui/icons-material/BadgeTwoTone';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useQuery } from 'react-query';
import { fetchData } from '../../../utils/getDataUtil';

const Editor = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [broken, setBroken] = useState(window.matchMedia('(max-width:768px)').matches);

    const TOTAL_UNREAD_COUNT_URL = '/api/v1/notification/unread_editor_notis_count'
    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: unreadCount, error: unreadError,
        isLoading: unreadLoading, refetch } = useQuery(
            ['unreadEditorNotisCount', TOTAL_UNREAD_COUNT_URL],
            () => fetchData(TOTAL_UNREAD_COUNT_URL, axiosInst),
            {
                // keepPreviousData: true,
                staleTime: 10,
                refetchOnWindowFocus: true,
                refetchOnMount: true
            }
        );
    const breadcrumbNameMap = {
        'editor_dashboard': 'Editor Dashboard',
        'notification': 'Notifications',
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

    useEffect(() => {
        // Refetch notifications when location changes or button is clicked
        refetch();
    }, [location])


    // for activeStyle to be applied to the sidebar if on current page
    const currentPath = location.pathname;
    // for hover effect on sidebar menue
    const defaultStyle = {
        borderRadius: "10px",
        margin: "2px 4px 2px 5px",
        backgroundColor: "transparent",
        transition: "background-color 0.3s ease",
    };
    const activeStyle = {
        backgroundColor: "#CBCBCB", // active background color
        color: "#000", // active text color
        fontWeight: "bold", // active text weight
    };
    const handleMouseEnter = (e, path) => {
        const isActive = currentPath.startsWith(path);
        if (!isActive) {
            e.currentTarget.style.backgroundColor = "#CBCBCB"; // hover background color
        }
    };
    const handleMouseLeave = (e, path) => {
        const isActive = currentPath.startsWith(path);
        if (!isActive) {
            e.currentTarget.style.backgroundColor = "transparent"; // reset background color
        }
    };

    // Helper function to get the style based on the current path
    const getMenuItemStyle = (path) => {
        // Check if the current path matches the MenuItem's path
        const isActive = currentPath.startsWith(path);
        // Merge default style with active style if it's the active item
        return isActive ? { ...defaultStyle, ...activeStyle } : defaultStyle;
        // return isActive ? activeStyle : defaultStyle;
    };


    return (
        <div className="editor" >
            <div className={`${styles.editorNav}`} >
                <Navbar sticky='top'
                    className={`bg-body-tertiary ${styles.secNav}`} >
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
                        customBreakPoint="991px"
                        onBreakPoint={setBroken}
                        onBackdropClick={broken ? () => setCollapsed(true) : ''}
                    >
                        <Menu>
                            {broken && <MenuItem disabled >Editor Menu</MenuItem>}
                            {/* {broken && <MenuItem style={{ marginBottom: "40px" }} disabled >Editor</MenuItem>} */}
                            <MenuItem
                                style={getMenuItemStyle("/editor_dashboard/profile")}
                                onMouseEnter={(e) => handleMouseEnter(e, "/editor_dashboard/profile")}
                                onMouseLeave={(e) => handleMouseLeave(e, "/editor_dashboard/profile")}
                                component={<Link to="/editor_dashboard/profile" />}
                                icon={<BadgeTwoToneIcon />}>Editor Profile</MenuItem>

                            <MenuItem
                                style={getMenuItemStyle("/editor_dashboard/notification")}
                                onMouseEnter={(e) => handleMouseEnter(e, "/editor_dashboard/notification")}
                                onMouseLeave={(e) => handleMouseLeave(e, "/editor_dashboard/notification")}
                                component={<Link to="/editor_dashboard/notification" />}
                                icon={<Badge
                                    count={unreadCount?.totalUnread ? unreadCount.totalUnread : 0}
                                    overflowCount={5} color="#f5222d" >
                                    <NotificationsTwoToneIcon />
                                </Badge>}>
                                Notification
                            </MenuItem>
                            <MenuItem
                                style={getMenuItemStyle("/editor_dashboard/review")}
                                onMouseEnter={(e) => handleMouseEnter(e, "/editor_dashboard/review")}
                                onMouseLeave={(e) => handleMouseLeave(e, "/editor_dashboard/review")}
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

                <main className={`${styles.editorContent} 
                ${!collapsed ? styles.expandedEditor : ''}`}
                    style={{ padding: 0 }}>
                    {/* <div className={`${styles.editorBreadcrumb}`} >
                        <Breadcrumb items={breadcrumbItems} />
                    </div> */}
                    <div style={{
                        // marginTop: "25px",
                        // paddingTop: 10
                    }}>
                        <Outlet />
                    </div>
                    <GoToTopButton />
                </main>
            </div>
        </div>
    );
}

export default Editor;