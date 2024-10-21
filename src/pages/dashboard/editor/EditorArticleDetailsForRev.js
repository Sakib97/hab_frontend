import styles from '../../../css/EditorArticleDetailsForRev.module.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar } from 'antd';
import { Col, Row } from 'antd';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

const EditorArticleDetailsForRev = () => {
    const avatarUrl = 'https://i.ibb.co.com/v3bscpR/home.jpg'
    return (
        // <div style={{
        //     // paddingLeft: "350px",
        //     // display: "flex"
        //     // position: "static"
        //     display: "flex", justifyContent: "center", alignItems: "center",
        //     // backgroundColor: "#e5f5f5"
        // }}>
            <div className={`${styles.outerContainer}`}>
                <div className={styles.articleContainer}>
                    <h2 className={styles.title}>Lorem Insum Dolor Lorem Insum Dolor Lorem Insum Dolor</h2>
                    <h3 className={styles.subtitle}>নির্বাচন কমিশন পুনর্গঠনে শিগগিরই সার্চ কমিটি</h3>

                    <div className={styles.infoRow}>
                        <span className={styles.category}>Category: <strong>Lorem</strong></span>
                        <span className={styles.subcategory}>Sub-category: <strong>Ipsum</strong></span>
                        <span className={styles.tagRequest}>New Tag Request: <strong>Ipsum</strong> <a href="#">[Approve]</a> <a href="#">[Decline]</a></span>
                    </div>

                    <div className={styles.authorDate}>
                        <Avatar src={<img src={avatarUrl} alt="avatar" />}
                            size={20} icon={<UserOutlined />} />
                        &nbsp;&nbsp;
                        <span className={styles.authorStatus}>
                            Lorem Dolor
                        </span>
                        <span className={styles.separator}>||</span>
                        <span className={styles.date}>30 June 2024, 11:55 AM</span>
                    </div>

                    <hr className={styles.divider} />
                </div>

                <div >
                    <h2>Hello World</h2>
                </div>

                <div className={styles.articleContainer}>
                    <h2 className={styles.title}>Lorem Insum Dolor Lorem Insum Dolor Lorem Insum Dolor</h2>
                    <h3 className={styles.subtitle}>নির্বাচন কমিশন পুনর্গঠনে শিগগিরই সার্চ কমিটি</h3>

                    <div className={styles.infoRow}>
                        <span className={styles.category}>Category: <strong>Lorem</strong></span>
                        <span className={styles.subcategory}>Sub-category: <strong>Ipsum</strong></span>
                        <span className={styles.tagRequest}>New Tag Request: <strong>Ipsum</strong> <a href="#">[Approve]</a> <a href="#">[Decline]</a></span>
                    </div>

                    <div className={styles.authorDate}>
                        <Avatar src={<img src={avatarUrl} alt="avatar" />}
                            size={20} icon={<UserOutlined />} />
                        &nbsp;&nbsp;
                        <span className={styles.authorStatus}>
                            Lorem Dolor
                        </span>
                        <span className={styles.separator}>||</span>
                        <span className={styles.date}>30 June 2024, 11:55 AM</span>
                    </div>
                    <hr className={styles.divider} />
                </div>

                <div >
                    <h2>Hello World</h2>
                </div>

                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>

                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>

                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                <div >
                    <h2>Hello World</h2>
                </div>
                
            </div>

        // </div>
    );
}

export default EditorArticleDetailsForRev;