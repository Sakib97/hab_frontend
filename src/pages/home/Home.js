import useAuth from "../../hooks/useAuth";
import useProfileContext from "../../hooks/useProfileContext";
import styles from '../../css/Home.module.css'
// import image from './ghibli.png'

// import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
// import { Avatar, Card } from 'antd';
// const { Meta } = Card;

import Card from 'react-bootstrap/Card';
import { Divider } from 'antd';

const Home = () => {
    const { auth } = useAuth()
    const { profile, setProfile } = useProfileContext()


    return (
        <div className="home">
            <div className="container">
                {/* <h1>This is Home page</h1>
                
                <h3>
                    Name: {auth.email}  {auth.roles}<br />
                    Full Name: {profile.first_name} {profile.last_name}
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam, rem?
                </h3> */}
                <div className={`${styles.mainSection}`}>
                    <div className={`${styles.mainArticles}`}>
                        <Card className={`${styles.mainCard}`}>
                            <Card.Img variant="top" src="https://picsum.photos/400/180" />
                            <Card.Body>
                                <Card.Title>Special title treatment</Card.Title>
                                <Card.Text>
                                    Some quick example text to build on the card title and make up the
                                    bulk of the card's content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <br />

                        <div className={`${styles.subCardRow}`}>
                            <Card className={`${styles.subCard}`}>
                                <Card.Img variant="top" src="https://picsum.photos/400/180" />
                                <Card.Body>
                                    <Card.Title>Special title treatment</Card.Title>
                                </Card.Body>
                            </Card>

                            <Card className={`${styles.subCard}`}>
                                <Card.Img variant="top" src="https://picsum.photos/400/180" />
                                <Card.Body>
                                    <Card.Title>Special title treatment</Card.Title>
                                </Card.Body>
                            </Card>

                            <Card className={`${styles.subCard}`}>
                                <Card.Img variant="top" src="https://picsum.photos/400/180" />
                                <Card.Body>
                                    <Card.Title>Special title treatment</Card.Title>
                                </Card.Body>
                            </Card>
                        </div>
                    </div>

                    <div className={styles.verticalDivider}></div>

                    <hr className={styles.horizontalDividerMobile}></hr>

                    <div className={`${styles.featuredArticles}`}>

                        <div className={styles.headingDiv}>
                            <div className={styles.headingStart}></div>
                            <h4>Featured</h4>
                        </div>
                        <hr className={styles.horizontalDividerPC} />

                        {Array.from({ length: 5 }).map((_, index) => (
                            <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                <div className={`${styles.picOfArticle}`}>
                                    <img className={`${styles.picOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                                </div>
                                <div className={`${styles.titleOfArticle}`}>
                                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                </div>
                            </div>
                        ))}

                    </div>
                </div>

                <hr />

                <div className={styles.bangladeshSection}>
                    <div className={styles.headingDiv}>
                        <div className={styles.headingStart}></div>
                        <h4>Bangladesh</h4>
                    </div>

                    <div className={styles.mainBanSection}>
                        <div className={styles.mainBanCard}>
                            <Card className={`${styles.mainCard}`}>
                                <Card.Img variant="top" src="https://picsum.photos/400/180" />
                                <Card.Body>
                                    <Card.Title>Special title treatment</Card.Title>
                                    <Card.Text>
                                        Some quick example text to build on the card title and make up the
                                        bulk of the card's content.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </div>

                        <div className={styles.sideBanCard}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                    <div className={`${styles.picOfArticle}`}>
                                        <img className={`${styles.picOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                                    </div>
                                    <div className={`${styles.titleOfArticle}`}>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <hr />
                <div className={styles.popularSection}>
                    <div className={styles.headingDiv}>
                        <div className={styles.headingStart}></div>
                        <h4>Most Popular</h4>
                    </div>

                    <div className={styles.mainPopSection}>

                        <div className={styles.sidePopCard1}>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                    <div className={`${styles.picOfArticle}`}>
                                        <img className={`${styles.picOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                                    </div>
                                    <div className={`${styles.titleOfArticle}`}>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className={styles.sidePopCard2}>
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                    <div className={`${styles.picOfArticle}`}>
                                        <img className={`${styles.picOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                                    </div>
                                    <div className={`${styles.titleOfArticle}`}>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <hr />

                <div className={styles.OpinionSection}>
                    <div className={styles.headingDiv}>
                        <div className={styles.headingStart}></div>
                        <h4>Opinion</h4>
                    </div>

                    <div className={styles.mainOpinionSection}>

                        <div className={styles.sideOpinionCard1}>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                    <div className={`${styles.picOfOpinion}`}>
                                        <img className={`${styles.picOfOpinion}`} src="https://picsum.photos/400/180" alt="" />
                                    </div>
                                    <div className={`${styles.titleOfArticle}`}>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                        <br />
                                        <span style={{ fontSize: '13px', color: 'gray' }}>John Doe</span>
                                    </div>

                                </div>
                            ))}
                        </div>

                        <div className={styles.sideOpinionCard2}>
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                    <div className={`${styles.picOfOpinion}`}>
                                        <img className={`${styles.picOfOpinion}`} src="https://picsum.photos/400/180" alt="" />
                                    </div>
                                    <div className={`${styles.titleOfArticle}`}>
                                        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                        <br />
                                        <span style={{ fontSize: '13px', color: 'gray' }}>John Doe</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
            <div className={styles.footer}>
                <hr />
                <h3 style={{marginLeft: '10px'}}>History and Beyond</h3>
                <div className={styles.footerBars}>
                    <div className={styles.footerOptionsBar1}>
                        <h6 style={{ paddingBottom: '5px' }}>About Us</h6>
                        <h6 style={{ paddingBottom: '5px' }}>Join as Contributor </h6>
                        <h6 style={{ paddingBottom: '5px' }}>Terms and Conditions</h6>
                    </div>
                    <div className={styles.footerOptionsBar2}>
                        <h6 style={{ paddingBottom: '5px' }}>Conatct Us</h6>
                        <h6 style={{ paddingBottom: '5px' }}>Privacy Policy</h6>
                    </div>


                </div>
                <span style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
                    © 2025 History and Beyond. All Rights Reserved.
                </span>

            </div>
        </div>
    );
}

export default Home;
