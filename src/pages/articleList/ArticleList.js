import { Link, useParams } from 'react-router-dom';
import styles from '../../css/ArticleList.module.css'
import styles2 from '../../css/Home.module.css'
import Card from 'react-bootstrap/Card';
import Footer from '../../components/Footer';
import { fetchData } from '../../utils/getDataUtil';
import axios from '../../api/axios';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { deSlugify } from '../../utils/slugAndStringUtil';

const ArticleList = () => {
    // categoryName is actuall category slug, which is unique
    const { categorySlug } = useParams();
    const GET_SUBCAT_BY_CAT_SLUG_URL = `/api/v1/category/get_subcat_by_cat_slug/${categorySlug}`

    const axiosInst = axios;
    const { data: subcatData, error: subcatError, isLoading: subcatLoading } = useQuery(
        ['submenuData', GET_SUBCAT_BY_CAT_SLUG_URL],
        () => fetchData(GET_SUBCAT_BY_CAT_SLUG_URL, axiosInst),
        {
            // staleTime: 60,  // Example option: Cache data for 6 seconds
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );

    const [orderedSubCats, setOrderedSubCats] = useState([]);
    useEffect(() => {
        if (subcatData) {
            // Sort the subcat array by subcategory_order (ascending)
            subcatData.sort((a, b) => a.subcategory_order - b.subcategory_order);
            const mappedSubCats = subcatData.map(subcat => ({
                name: subcat.subcategory_name,
                path: `/category/${categorySlug}/${subcat.subcategory_slug}`
            }));
            setOrderedSubCats(mappedSubCats);
        } else {
            setOrderedSubCats([]);
        }

    }, [subcatData]);

    return (
        <div className={`${styles.articleList}`}>
            <div className='container'>
                <h1> {deSlugify(categorySlug)} </h1>

                <div className={`${styles.subCatList}`}>
                    {orderedSubCats.map((subCat, index) => (
                        <div key={index} className={`${styles.subCatItem}`}>
                            <Link to={subCat.path}
                                
                                className={`${styles.subCatItemLink}`}>

                                { subCat.name}
                            </Link>
                            {/* // If not the last item, show the separator */}
                            {subCat !== orderedSubCats[orderedSubCats.length - 1] &&
                                <i className={`${styles.subCatItemSeperator} fa-solid fa-circle`}></i>
                            }

                        </div>
                    ))}
                </div>

                <hr />

                <div className={`${styles.featuredArticles}`}>

                    <div className={styles2.bangladeshSection}>
                        <div className={styles2.mainBanSection}>

                            <div className={styles2.mainBanCard}>
                                <Card className={`${styles2.mainCard}`}>
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

                            <div className={styles2.sideBanCard}>
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className={`${styles2.picAndTitleOfArticle}`}>
                                        <div className={`${styles2.picOfArticle}`}>
                                            <img className={`${styles2.picOfArticle}`} src="https://picsum.photos/400/180" alt="" />
                                        </div>
                                        <div className={`${styles2.titleOfArticle}`}>
                                            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatum, quae?
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>

                <hr />

                <div className={`${styles.articleListContainer}`}>
                    <div>
                        <div className={`${styles.articleListItems}`}>
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className={`${styles.articleListItem}`}>
                                    <div>
                                        <h4> <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b> </h4>
                                        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptatibus.</div>
                                        <div style={{ fontSize: '14px', marginTop: '5px', color: '#888' }}>
                                            <i style={{ marginRight: '8px' }} className="fa-regular fa-clock"></i>
                                            11 April 2025
                                        </div>
                                    </div>

                                    <img className={`${styles.articleListItemPic}`} src="https://picsum.photos/400/180" alt="" />

                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

            <Footer />
        </div>
    );
}

export default ArticleList;