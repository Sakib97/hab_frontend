import { useRef, useState, useEffect } from 'react';
import styles from '../../../css/EditorArticleReview.module.css'
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Col, Divider, Row } from 'antd';

const EditorArticleReview = () => {
    const location = useLocation();
    const [activePath, setActivePath] = useState(location.pathname);

    useEffect(() => {
        setActivePath(location.pathname)
    }, [location])

    return (
        <div style={{ marginTop: "15px" }}>
            <div className={styles.navbar}>
                <div className={styles.navItems}>
                    <Link
                        to="/editor_dashboard/review/unreviwed-articles"
                        className={`${styles.link} ${activePath === '/editor_dashboard/review/unreviwed-articles' ? styles.activeLink : ''}`}
                        onClick={() => setActivePath('/editor_dashboard/review/unreviwed-articles')}
                    >
                        Unreviwed Articles
                    </Link> &nbsp;&nbsp;
                    <Link
                        to="/editor_dashboard/review/review-history"
                        className={`${styles.link} ${activePath === '/editor_dashboard/review/review-history' ? styles.activeLink : ''}`}
                        onClick={() => setActivePath('/editor_dashboard/review/review-history')}
                    >
                        Review History
                    </Link>
                    {/* <Row>
                        <Col span={12}><Link
                            to="/"
                            className={`${styles.link} ${activePath === '/' ? styles.activeLink : ''}`}
                            onClick={() => setActivePath('/')}
                        >
                            Unreviwed Articles
                        </Link></Col>
                        <Col span={12}><Link
                            to="/videos"
                            className={`${styles.link} ${activePath === '/videos' ? styles.activeLink : ''}`}
                            onClick={() => setActivePath('/videos')}
                        >
                            Review History
                        </Link></Col>
                    </Row> */}
                    {/* <div className={styles.searchIcon}>
                        <i className="fa fa-search"></i> 
                    </div> */}
                </div>
            </div>

            <div style={{
                paddingTop: "40px", 
                // display: "flex", justifyContent: "center", alignItems: "center"
                // display: "flex"
            }}
                className="unreviewd">
                {/* <h4>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate voluptatibus labore sed ducimus, dolorem magni, pariatur molestiae beatae dolor quibusdam impedit architecto. Officiis fugiat qui minus ipsa hic sapiente odit?</h4> */}
                <Outlet />
            </div>
        </div>

    );
}

export default EditorArticleReview;