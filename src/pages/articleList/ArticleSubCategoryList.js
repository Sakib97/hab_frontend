import styles from '../../css/ArticleList.module.css'
import { Link, useParams } from 'react-router-dom';
import { deSlugify, slugify } from '../../utils/slugAndStringUtil';
import Footer from '../../components/Footer';
import { useState } from 'react';
import { List, Button, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { fetchData } from '../../utils/getDataUtil';
import { useQuery } from 'react-query';
import { getFormattedTime } from '../../utils/dateUtils';
import axios from '../../api/axios';
const ArticleSubCategoryList = () => {
    const { categorySlug, subcategorySlug } = useParams();
    const [articles, setArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);
    const pageSize = 1;
    const GET_ARTICLE_LIST_BY_SUBCAT_SLUG_URL = `/api/v1/article/published_article_list/${categorySlug}?subcatSlug=${subcategorySlug}&page=${page}&limit=${pageSize}`

    const axiosPrivate = useAxiosPrivate();
    // const axiosInst = axiosPrivate;
    const axiosInst = axios;

    const { data: articlesBySubcatData, error: articlesBySubcatError,
        isLoading: articlesBySubcatLoading,
        isFetching: articlesBySubcatFetching } = useQuery(
            ['articlesBySubcatData', GET_ARTICLE_LIST_BY_SUBCAT_SLUG_URL],
            () => fetchData(GET_ARTICLE_LIST_BY_SUBCAT_SLUG_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
                onSuccess: (data) => {
                    setTotalCount(data.totalCount);
                    setArticles((prev) => [...prev, ...data.articles]);
                }
            }
        );

    // Load more articles
    const loadMoreData = () => {
        if (articles?.length < totalCount) {
            setPage((prev) => prev + 1);
        }
    };

    // Ant Design load more button
    const loadMore = (
        articles?.length < totalCount && (
            <div style={{ textAlign: 'center', margin: 16 }}>
                {articlesBySubcatFetching ? (
                    <Spin indicator={<LoadingOutlined
                        style={{ fontSize: 48, color: 'darkblue' }} />} />
                ) : (
                    <Button className={`${styles.loadMoreBtn}`}
                        onClick={loadMoreData}>
                        Load More
                    </Button>
                )}
            </div>
        )
    );

    return (
        <div className={`${styles.articleList}`}>
            <div style={{ minHeight: '100vh' }} className='container'>
                <div style={{ marginTop: '10px', fontSize: "25px", fontWeight: "bold" }}>
                    <Link style={{ color: 'black' }}
                        onMouseOver={(e) => e.target.style.color = '#007bff'}
                        onMouseOut={(e) => e.target.style.color = 'black'}
                        to={`/category/${categorySlug}`}>
                        <span style={{ fontSize: "27px" }}>{deSlugify(categorySlug)}</span>
                    </Link>
                    &nbsp; {'>'} &nbsp;
                    {deSlugify(subcategorySlug)}
                </div>

                <div className={`${styles.articleListContainer}`}>

                    {articlesBySubcatLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'black' }}>
                            Loading..
                        </div>
                        // "Loading..."
                    )
                        : articlesBySubcatError ? (
                            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'red' }}>
                                Server Error!
                            </div>
                        ) : (
                            <div>
                                <div className={`${styles.articleListItems}`}>
                                    <List
                                        itemLayout="vertical"
                                        dataSource={articles}
                                        loadMore={loadMore}
                                        renderItem={(item, index) => (
                                            <List.Item key={item.article_id} >
                                                <Link className={`${styles.articleListItemContent}`}
                                                    to={`/${categorySlug}/${subcategorySlug}/article/${item.article_id}/${slugify(item.title_en)}`}>
                                                    <div className={`${styles.articleListItem}`}>
                                                        <div >
                                                            <div style={{ fontSize: '25px', fontWeight: 'bold', color: 'darkblue' }}>
                                                                {item.title_en}
                                                            </div>

                                                            <div style={{ fontSize: '17px' }}>{item.subtitle_en}</div>

                                                            <div style={{ fontSize: '16px', marginTop: '5px', color: '#555' }}>
                                                                <i className="fa-regular fa-user"></i>
                                                                &nbsp; {item.author_firstname} {item.author_lastname}
                                                            </div>
                                                            <div style={{ fontSize: '14px', marginTop: '5px', color: '#888' }}>
                                                                <i style={{ marginRight: '8px' }} className="fa-regular fa-clock"></i>
                                                                {getFormattedTime(item.published_at)}
                                                            </div>

                                                        </div>
                                                        <img
                                                            className={`${styles.articleListItemPic}`}
                                                            src={item.cover_img_link}
                                                            alt={item.title_en}
                                                        />
                                                    </div>
                                                </Link>
                                            </List.Item>
                                        )}
                                    />
                                </div>
                            </div>
                        )
                    }



                </div>

            </div>
            <Footer />
        </div>
    );
}

export default ArticleSubCategoryList;