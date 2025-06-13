import { Link, useLocation, useParams } from 'react-router-dom';
import styles from '../../css/ArticleList.module.css'
import styles2 from '../../css/Home.module.css'
import Card from 'react-bootstrap/Card';
import Footer from '../../components/Footer';
import { fetchData } from '../../utils/getDataUtil';
import axios from '../../api/axios';
import { useInfiniteQuery, useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import { deSlugify, slugify } from '../../utils/slugAndStringUtil';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { getFormattedTime } from '../../utils/dateUtils';
import { Button, List, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import { useQueryClient } from 'react-query';

const ArticleList = () => {
    const location = useLocation();
    const queryClient = useQueryClient();

    // categoryName is actually category slug, which is unique
    const { categorySlug } = useParams();

    // Remove any cached data for this category slug
    // Clear previous pagination cache if resetPagination is true
    // useEffect(() => {
    //     if (location.state?.resetPagination) {
    //         queryClient.removeQueries(['articlesByCatSlug', categorySlug]);
    //         window.scrollTo(0, 0); // Optionally reset scroll
    //     }
    // }, [categorySlug, location.state?.resetPagination]);

    const [allArticles, setAllArticles] = useState([]);
    const [featuredArticles, setFeaturedArticles] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [page, setPage] = useState(1);

    const pageSize = 2;

    const GET_SUBCAT_BY_CAT_SLUG_URL = `/api/v1/category/get_subcat_by_cat_slug/${categorySlug}`
    const GET_ARTICLE_LIST_BY_CAT_SLUG_URL = `/api/v1/article/published_article_list/${categorySlug}?page=${page}&limit=${pageSize}`
    const GET_FEATURED_ARTICLE_LIST_URL = `/api/v1/article/featured_article_list/${categorySlug}?limit=5`
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


    // --------------------
    // get articles by category slug
    // const { data: articlesByCatData, error: articlesByCatError,
    //     isLoading: articlesByCatLoading,
    //     isFetching: articlesByCatFetching } = useQuery(
    //         ['articlesByCatData', GET_ARTICLE_LIST_BY_CAT_SLUG_URL],
    //         () => fetchData(GET_ARTICLE_LIST_BY_CAT_SLUG_URL, axiosInst),
    //         {
    //             keepPreviousData: true, // Preserve previous data while fetching new
    //             // staleTime: 600,  // Example option: Cache data for 6 seconds
    //             refetchOnWindowFocus: false,  // Disable refetch on window focus
    //             onSuccess: (data) => {
    //                 setTotalCount(data.totalCount);
    //                 setAllArticles((prev) => [...prev, ...data.articles]);
    //                 // setTotalCount((prevTotal) => prevTotal || data.totalCount);
    //                 // if (!location.state?.articles) {
    //                 //     setAllArticles((prev) => [...prev, ...data.articles]);
    //                 // }
    //             }
    //         }
    //     );

    const {
        data: articlesByCatData,
        error: articlesByCatError,
        isLoading: articlesByCatLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery(
        ['articlesByCatSlug', categorySlug],
        ({ pageParam = 1 }) =>
            fetchData(`/api/v1/article/published_article_list/${categorySlug}?page=${pageParam}&limit=${pageSize}`, axiosInst),
        {
            getNextPageParam: (lastPage, pages) => {
                if (pages.flatMap(p => p.articles).length < lastPage.totalCount) {
                    return pages.length + 1;
                }
                return undefined;
            },
            keepPreviousData: false,
            // staleTime: 600,  // Example option: Cache data for 6 seconds
            refetchOnWindowFocus: false,
        }
    );

    // Load more articles
    // const loadMoreData = () => {
    //     if (allArticles?.length < totalCount) {
    //         setPage((prev) => prev + 1);
    //     }
    // };

    // // Ant Design load more button
    // const loadMore = (
    //     allArticles?.length < totalCount && (
    //         <div style={{ textAlign: 'center', margin: 16 }}>
    //             {articlesByCatFetching ? (
    //                 <Spin indicator={<LoadingOutlined
    //                     style={{ fontSize: 48, color: 'darkblue' }} />} />
    //             ) : (
    //                 <Button className={`${styles.loadMoreBtn}`}
    //                     onClick={loadMoreData}>
    //                     Load More
    //                 </Button>
    //             )}
    //         </div>
    //     )
    // );

    // --------------------
    // get featured articles by category slug
    const { data: featuredArtByCatData, error: featuredArtByCatError,
        isLoading: featuredArtByCatLoading,
        isFetching: featuredArtByCatFetching } = useQuery(
            ['featuredArtByCatData', GET_FEATURED_ARTICLE_LIST_URL],
            () => fetchData(GET_FEATURED_ARTICLE_LIST_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
                onSuccess: (data) => {
                    // setTotalCount(data.totalCount);
                    setFeaturedArticles((prev) => [...prev, ...data.articles]);

                }
            }
        );

    const renderLoadMore = () => {
        if (!hasNextPage) return null;

        return (
            <div style={{ textAlign: 'center', margin: 16 }}>
                {isFetchingNextPage ? (
                    <Spin indicator={<LoadingOutlined
                        style={{ fontSize: 48, color: 'darkblue' }} />} />
                ) : (
                    <Button className={`${styles.loadMoreBtn}`}
                        onClick={() => fetchNextPage()}>Load More
                    </Button>
                )}
            </div>
        );
    };


    return (
        <div className={`${styles.articleList}`}>
            <div style={{ minHeight: '100vh' }} className='container'>
                <h1> {deSlugify(categorySlug)} </h1>

                <div className={`${styles.subCatList}`}>
                    {orderedSubCats.map((subCat, index) => (
                        <div key={index} className={`${styles.subCatItem}`}>
                            <Link to={subCat.path}

                                className={`${styles.subCatItemLink}`}>

                                {subCat.name}
                            </Link>
                            {/* // If not the last item, show the separator */}
                            {subCat !== orderedSubCats[orderedSubCats.length - 1] &&
                                <i className={`${styles.subCatItemSeperator} fa-solid fa-circle`}></i>
                            }

                        </div>
                    ))}
                </div>

                <hr />

                <div className={`${styles.featuredArticless}`}>
                    {featuredArtByCatLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'black' }} >
                            Loading..
                        </div>
                    ) : featuredArtByCatError ? (
                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'red' }} >
                            Server Error!
                        </div>
                    ) : featuredArtByCatData?.articles?.length > 0 &&
                    <div className={styles2.mainBanSection}>

                        <div className={styles2.mainBanCard}>
                            {/* {featuredArtByCatLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'black' }} >
                                    Loading..
                                </div>
                            ) : featuredArtByCatError ? (
                                <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'red' }} >
                                    Server Error!
                                </div>
                            ) : featuredArtByCatData?.articles?.length > 0 && */}
                            <Link className={`${styles.articleListItemContent}`}
                                to={`/${categorySlug}/${slugify(featuredArtByCatData?.articles?.[0]?.subcategory_name)}/article/${featuredArtByCatData?.articles?.[0]?.article_id}/${slugify(featuredArtByCatData?.articles?.[0]?.title_en)}`}
                            >
                                <Card className={`${styles.articleListItemContent}`} >
                                    {/* className={`${styles2.mainCard}`} */}
                                    <Card.Img className={`${styles.articleListItemPic}`} variant="top" src={featuredArtByCatData?.articles?.[0]?.cover_img_link}
                                        alt={featuredArtByCatData?.articles?.[0]?.title_en} />
                                    <Card.Body>
                                        <Card.Title> <div style={{ fontSize: '25px', fontWeight: 'bold', color: 'darkblue' }}>
                                            {featuredArtByCatData?.articles?.[0]?.title_en}
                                        </div>
                                        </Card.Title>
                                        <Card.Text >


                                            <div style={{ fontSize: '17px' }}>{featuredArtByCatData?.articles?.[0]?.subtitle_en}</div>

                                            <div style={{ fontSize: '16px', marginTop: '5px', color: '#555' }}>
                                                <i className="fa-regular fa-user"></i>
                                                &nbsp; {featuredArtByCatData?.articles?.[0]?.author_firstname} {featuredArtByCatData?.articles?.[0]?.author_lastname}
                                            </div>
                                            <div style={{ fontSize: '14px', marginTop: '5px', color: '#888' }}>
                                                <i style={{ marginRight: '8px' }} className="fa-regular fa-clock"></i>
                                                {getFormattedTime(featuredArtByCatData?.articles?.[0]?.published_at)}
                                            </div>

                                        </Card.Text>
                                    </Card.Body>
                                </Card>

                            </Link>
                            {/* } */}
                        </div>


                        <div className={styles2.sideBanCard}>

                            {featuredArtByCatData?.articles?.slice(1).map((article, index) => (
                                <Link className={`${styles.articleListItemContent}`}
                                    to={`/${categorySlug}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title_en)}`}>

                                    <div key={article.article_id} className={styles2.picAndTitleOfArticle}>
                                        <div className={styles2.picOfArticle}>
                                            <img
                                                className={styles2.picOfArticle}
                                                src={article.cover_img_link}
                                                alt={article.title_en}
                                            />
                                        </div>

                                        <div >
                                            <div style={{ fontSize: '15px', fontWeight: 'bold', color: 'darkblue', paddingLeft: '10px' }}>
                                                {article.title_en}
                                            </div>
                                            <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#555' }}>
                                                &nbsp; &nbsp;
                                                <i className="fa-regular fa-user"></i>
                                                &nbsp;
                                                {article.author_firstname} {article.author_lastname}
                                            </div>

                                            <div style={{ fontSize: '12px', marginTop: '5px', color: '#888' }}>
                                                &nbsp; &nbsp;
                                                <i style={{ marginRight: '8px' }} className="fa-regular fa-clock"></i>
                                                {getFormattedTime(article.published_at)}
                                            </div>

                                        </div>

                                    </div>
                                </Link>
                            ))}
                        </div>
                        {/* </div> */}

                    </div>
                    }

                </div>

                <hr />

                <div className={`${styles.articleListContainer}`}>

                    {articlesByCatLoading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'black' }}>
                            Loading..
                        </div>
                    )
                        : articlesByCatError ? (
                            <div style={{ display: 'flex', justifyContent: 'center', fontSize: '25px', fontWeight: 'bold', color: 'red' }}>
                                Server Error!
                            </div>
                        ) : (
                            <div>
                                <div className={`${styles.articleListItems}`}>
                                    <List
                                        itemLayout="vertical"
                                        // dataSource={allArticles}
                                        // loadMore={loadMore}
                                        dataSource={articlesByCatData?.pages.flatMap(page => page.articles) || []}
                                        // loadMore={hasNextPage && (
                                        //     <div style={{ textAlign: 'center', margin: 16 }}>
                                        //       {isFetchingNextPage ? (
                                        //         <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: 'darkblue' }} />} />
                                        //       ) : (
                                        //         <Button onClick={() => fetchNextPage()}>Load More</Button>
                                        //       )}
                                        //     </div>
                                        //   )}
                                        loadMore={renderLoadMore()}
                                        renderItem={(item, index) => (
                                            <List.Item key={item.article_id} >
                                                <Link className={`${styles.articleListItemContent}`}
                                                    to={`/${categorySlug}/${slugify(item.subcategory_name)}/article/${item.article_id}/${slugify(item.title_en)}`}
                                                >
                                                    <div className={`${styles.articleListItem}`}>
                                                        <div>
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


                                                {/* <img
                                                    className={`${styles.articleListItemPic}`}
                                                    src={item.cover_img_link}
                                                    alt={item.title_en}
                                                /> */}

                                                {/* </div>
                                                </Link> */}
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

export default ArticleList;