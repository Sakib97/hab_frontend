import useAuth from "../../hooks/useAuth";
import useProfileContext from "../../hooks/useProfileContext";
import styles from '../../css/Home.module.css'
import Footer from "../../components/Footer";
// import image from './ghibli.png'
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import { fetchData } from "../../utils/getDataUtil";
import axios from "../../api/axios";
import { slugify, deSlugify } from "../../utils/slugAndStringUtil";
import { timeAgo } from "../../utils/dateUtils";
import { useQuery } from "react-query";

const Home = () => {
    const { auth } = useAuth()
    const { profile, setProfile } = useProfileContext()
    const axiosInst = axios;
    const GET_LATEST_ARTICLES_URL = '/api/v1/article/latest_approved_article?limit=4';
    const GET_FEATURED_ARTICLES_URL = '/api/v1/article/featured_articles?limit=5';
    const GET_AMERICAS_ARTICLES_URL = '/api/v1/article/latest_approved_article?category_slug=americas&limit=5';
    const { data: latestArticlesData, error: latestArticlesError,
        isLoading: latestArticlestLoading } = useQuery(
            ['latestArticlesData', GET_LATEST_ARTICLES_URL],
            () => fetchData(GET_LATEST_ARTICLES_URL, axiosInst),
            {
                // staleTime: 60,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const { data: featuredArticlesData, error: featuredArticlesError,
        isLoading: featuredArticlestLoading } = useQuery(
            ['featuredArticlesData', GET_FEATURED_ARTICLES_URL],
            () => fetchData(GET_FEATURED_ARTICLES_URL, axiosInst),
            {
                // staleTime: 60,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const { data: americasArticlesData, error: americasArticlesError,
        isLoading: americasArticlestLoading } = useQuery(
            ['americasArticlesData', GET_AMERICAS_ARTICLES_URL],
            () => fetchData(GET_AMERICAS_ARTICLES_URL, axiosInst),
            {
                // staleTime: 60,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    if (latestArticlestLoading) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            fontSize: '30px'
        }}>Loading...</h3>;
    }

    if (latestArticlesError) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Error Loading Articles !</h3>;
    }

    return (
        <div className="home">
            <div className="container">

                <div className={`${styles.mainSection}`}>
                    {
                        latestArticlestLoading ? (
                            <div>Loading...</div>
                        ) : latestArticlesError ? (
                            <div>Error loading articles !</div>
                        ) : (
                            latestArticlesData?.length > 0 ? (
                                <div className={`${styles.mainArticles}`}>
                                    {/* /americas/mexico/article/87/this-component-s-rendering-logic-correctly-accounts-for-the-fact-that */}

                                    <Card className={`${styles.mainCard}`}>
                                        <Link
                                            className={`${styles.linkStyle}`}
                                            to={`/${slugify(latestArticlesData?.[0]?.category_name)}/${slugify(latestArticlesData?.[0]?.subcategory_name)}/article/${latestArticlesData?.[0]?.article_id}/${slugify(latestArticlesData?.[0]?.title)}`}>
                                            <Card.Img variant="top"
                                                style={{ height: '200px', objectFit: 'cover' }}
                                                src={latestArticlesData?.[0]?.cover_img_link} />
                                            <Card.Body className={`${styles.subCardBody}`}>
                                                <Card.Title>
                                                    <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                        {latestArticlesData?.[0]?.title}
                                                    </span>
                                                </Card.Title>
                                                <Card.Text>
                                                    {latestArticlesData?.[0]?.subtitle}
                                                </Card.Text>
                                                <span style={{ fontSize: '13px', color: 'gray', textDecoration: 'none' }}>
                                                    {timeAgo(latestArticlesData?.[0]?.published_at)}
                                                </span>
                                            </Card.Body>
                                        </Link>
                                    </Card>

                                    <div className={`${styles.subCardRow}`}>
                                        {latestArticlesData?.slice(1).map((article, index) => (
                                            <Card className={`${styles.subCard}`}>

                                                <Link
                                                    key={index}
                                                    className={`${styles.linkStyle}`}
                                                    to={`/${slugify(article.category_name)}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title)}`}>
                                                    {/* <Card className={`${styles.subCard}`}> */}
                                                    <Card.Img variant="top"
                                                        style={{ height: '100px', objectFit: 'cover' }}
                                                        src={article.cover_img_link} />
                                                    <Card.Body className={`${styles.subCardBody}`}>
                                                        <Card.Title>
                                                            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>
                                                                {article.title}
                                                            </span>
                                                        </Card.Title>
                                                        <span style={{ fontSize: '13px', color: 'gray', textDecoration: 'none' }}>
                                                            {timeAgo(article.published_at)}
                                                        </span>
                                                    </Card.Body>
                                                    {/* </Card> */}
                                                </Link>
                                            </Card>
                                        ))

                                        }
                                    </div>

                                </div>

                            ) : (
                                <div>No articles found.</div>
                            )
                        )}


                    <div className={styles.verticalDivider}></div>

                    <hr className={styles.horizontalDividerMobile}></hr>

                    {featuredArticlestLoading ? (
                        <div>Loading...</div>
                    ) : featuredArticlesError ? (
                        <div>Error loading featured articles !</div>
                    ) : (
                        featuredArticlesData?.length > 0 ? (
                            <div className={`${styles.featuredArticles}`}>

                                <div className={styles.headingDiv}>
                                    <div className={styles.headingStart}></div>
                                    <h4>Featured</h4>
                                </div>
                                <hr className={styles.horizontalDividerPC} />

                                {featuredArticlesData?.map((article, index) => (
                                    <div key={index} className={`${styles.picAndTitleOfArticle}`}>

                                        <div className={`${styles.picOfArticle}`}>
                                            <img className={`${styles.picOfArticle}`} src={article.cover_img_link} alt="" />
                                        </div>
                                        <Link to={`/${slugify(article.category_name)}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title_en)}`}
                                            className={`${styles.linkStyle}`}>
                                            <div className={`${styles.titleOfArticle}`}>
                                                {article.title_en} <br />
                                                <span style={{ fontSize: '13px', color: 'gray', textDecoration: 'none' }}>
                                                    {timeAgo(article.published_at)}
                                                </span>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>No articles found.</div>
                        )
                    )}
                    {/* <div className={`${styles.featuredArticles}`}>

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

                    </div> */}
                </div>

                <hr />

                <div className={styles.bangladeshSection}>
                    <div className={styles.headingDiv}>
                        <div className={styles.headingStart}></div>
                        <h4>Americas</h4>
                    </div>

                    {americasArticlesData?.length > 0 ? (
                        <div className={styles.mainBanSection}>
                            <div className={styles.mainBanCard}>
                                <Card className={`${styles.mainCard}`}>
                                    <Link to={`/${slugify(americasArticlesData?.[0]?.category_name)}/${slugify(americasArticlesData?.[0]?.subcategory_name)}/article/${americasArticlesData?.[0]?.article_id}/${slugify(americasArticlesData?.[0]?.title)}`}
                                        className={`${styles.linkStyle}`}>
                                        <Card.Img style={{ height: '200px', objectFit: 'cover' }}
                                            variant="top" src={americasArticlesData?.[0]?.cover_img_link} />
                                        <Card.Body className={`${styles.subCardBody}`}>
                                            <Card.Title>
                                                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                                                    {americasArticlesData?.[0]?.title}
                                                </span>
                                            </Card.Title>
                                            <Card.Text>
                                                {americasArticlesData?.[0]?.subtitle}
                                            </Card.Text>
                                            <span style={{ fontSize: '13px', color: 'gray', textDecoration: 'none' }}>
                                                {timeAgo(americasArticlesData?.[0]?.published_at)}
                                            </span>
                                        </Card.Body>
                                    </Link>
                                </Card>
                            </div>

                            <div className={styles.sideBanCard}>
                                {americasArticlesData?.slice(1).map((article, index) => (
                                    <div key={index} className={`${styles.picAndTitleOfArticle}`}>
                                        <div className={`${styles.picOfArticle}`}>
                                            <img className={`${styles.picOfArticle}`} src={article.cover_img_link} alt="" />
                                        </div>
                                        <Link to={`/${slugify(article.category_name)}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title)}`}
                                            className={`${styles.linkStyle}`}>
                                            <div className={`${styles.titleOfArticle}`}>
                                                {article.title} <br />
                                                <span style={{ fontSize: '13px', color: 'gray', textDecoration: 'none' }}>
                                                    {timeAgo(article.published_at)}
                                                </span>
                                            </div>
                                        </Link>

                                    </div>
                                ))}
                            </div>

                        </div>
                    ) : (

                        <div style={{ padding: "20px", fontSize: "18px", color: "gray" }}>
                            No articles found.
                        </div>
                    )

                    }

                </div>

                {/* <hr />
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

                </div> */}

                {/* <hr />
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

                </div> */}

            </div>
            <Footer />

        </div>
    );
}

export default Home;
