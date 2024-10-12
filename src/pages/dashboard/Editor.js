import { useState, useMemo, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import styles from '../../css/Editor.module.css'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { useMediaQuery } from '@mui/material';
import { Button } from 'react-bootstrap';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import GradingIcon from '@mui/icons-material/Grading';
import CategoryTwoToneIcon from '@mui/icons-material/CategoryTwoTone';
import NotificationsTwoToneIcon from '@mui/icons-material/NotificationsTwoTone';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';

import GoToTopButton from '../../components/GoToTopButton';

const Editor = () => {
    const [collapsed, setCollapsed] = useState(true);
    const [broken, setBroken] = useState(window.matchMedia('(max-width:768px)').matches);

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
                <Navbar className={`bg-body-tertiary ${styles.secNav}`} >
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

            <div style={{ display: 'flex', height: '100%', minHeight: '400px', marginTop: '50px' }}>
                <div className={`${styles.editorSidebar}`} >
                    {/* className={`${styles.editorMenu}`} */}
                    <Sidebar
                        // style={{width: "80px"}}
                        backgroundColor={broken ? "white" : " #f0f0f0"}
                        collapsed={collapsed}
                        toggled={broken && !collapsed}
                        customBreakPoint="768px"
                        onBreakPoint={setBroken}
                        onBackdropClick={broken ? () => setCollapsed(true) : ''}
                    >
                        <Menu>
                            {broken && <MenuItem disabled >Editor</MenuItem>}
                            {broken && <MenuItem style={{ marginBottom: "20px" }} disabled >Editor</MenuItem>}
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
                                icon={<NotificationsTwoToneIcon />}>Notification</MenuItem>
                            <MenuItem
                                style={defaultStyle}
                                onMouseEnter={handleMouseEnter}
                                onMouseLeave={handleMouseLeave}
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
                            {/* <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<EditNoteTwoToneIcon />}>Write Note</MenuItem>
                            <MenuItem icon={<GradingIcon />}> Article Reviews</MenuItem> */}

                        </Menu>
                    </Sidebar>
                </div>

                <main style={{ padding: 10 }}>
                    <div >
                        <h1>This is Editor's Dashboard ! </h1>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, obcaecati excepturi velit dolor consequatur molestiae a deleniti neque ipsam veritatis. Est quis, sapiente mollitia consectetur suscipit odio nemo quo! Officia et, ab corporis qui dignissimos cupiditate a molestias nisi eos non itaque nam ipsum repellat aliquam, repudiandae officiis explicabo! Tenetur eum numquam iste, fugiat quisquam harum hic doloribus suscipit esse fuga iure repellat provident ea tempora natus voluptas inventore reiciendis nihil vero dignissimos dolor. Ipsam unde et repellat id recusandae, provident nisi, quidem porro non distinctio beatae quasi. Reprehenderit, sequi. Esse quis sed soluta quibusdam fugit ipsa aperiam veniam illo unde a! Voluptate ipsam iure velit sequi dolorum quia laborum illum ad odit autem at, asperiores tenetur qui neque sit laudantium quibusdam nihil voluptas eveniet reprehenderit temporibus odio fuga? Ex accusantium aperiam fuga numquam nulla in assumenda officia eligendi, laborum autem omnis error, reprehenderit facere pariatur animi adipisci voluptatem rem corrupti praesentium. Dolorum atque placeat enim aperiam saepe! Cumque earum nam quos id, dolores cum asperiores excepturi dolorem totam dicta eius unde? Doloribus beatae odio placeat in. Inventore, voluptates expedita, omnis quaerat suscipit esse doloribus ex optio minima hic voluptatum? Optio obcaecati excepturi saepe molestias repellat exercitationem molestiae, eveniet magnam.
                        </p>
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
                    </div>
                    <GoToTopButton />
                </main>
            </div>
        </div>
    );
}

export default Editor;