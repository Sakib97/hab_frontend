import styles from '../../../css/Editor.module.css'
import { fetchData } from '../../../utils/getDataUtil';
import { useQuery, useQueryClient } from 'react-query';
import { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { getFormattedTime } from '../../../utils/dateUtils';
import useAuth from '../../../hooks/useAuth';
import { List } from 'antd';
import { slugify } from '../../../utils/slugAndStringUtil';

const EditorReviewHistory = () => {

    const { auth } = useAuth()
    const queryClient = useQueryClient();

    // for loading new articles only when new page 
    // (from pagination) is being loaded
    const [page, setPage] = useState(1);
    const pageSize = 2;


    const editor_mail = auth?.email
    const ALL_EDITOR_ARTICLES_URL = `/api/v1/article/all_article_by_email/editor/${editor_mail}?page=${page}&limit=${pageSize}`

    // To ensure ALL_EDITOR_ARTICLES_URL 
    // is called on every mount, we remove any cache--------
    useEffect(() => {
        queryClient.removeQueries(['editorArticlesData']);
    }, []);
    // -----------------------------------------------


    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    const { data: editorArticlesData, error: editorArticlesError,
        isLoading: editorArticlesLoading } = useQuery(
            ['editorArticlesData', ALL_EDITOR_ARTICLES_URL, page],
            () => fetchData(ALL_EDITOR_ARTICLES_URL, axiosInst),
            {
                keepPreviousData: false, // Preserve previous data while fetching new
                // staleTime: 60000,  // Example option: Cache data for 60 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );
    // console.log("unrevData:: ", unrevData);
    const [displayedArticles, setDisplayedArticles] = useState([]);

    // -------------------------------------------------------
    // --- useEffect to process data when authorArticlesData changes ---
    useEffect(() => {
        //  console.log("authorArticlesData changed, processing...");
        // This code runs whenever authorArticlesData changes (including initial load)
        const processedData = editorArticlesData?.articles?.map(article => ({
            href: article.article_status === "approved" ?
                `/${slugify(article.category_name)}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title_en)}`
                : article.article_status === "rejected" ? ''
                    : article.article_status.split('_').slice(0, -1).join('_') === "sent_for_edit" ?
                        ''
                        : article.article_status.split('_').slice(0, 2).join('_') === "under_review" ?
                            `/editor_dashboard/review/article-review/${article.article_id}`
                            : '',
            title: article.title_en,
            status: article.article_status,
            description: `Submission Time: ${getFormattedTime(article.submitted_at)}`,
            content: article.subtitle_en,
            cover_img_link: article.cover_img_link,
            category_name: article.category_name,
            subcategory_name: article.subcategory_name,
            // article
        })) || [];

        // Update the state with the processed data
        setDisplayedArticles(processedData);

    }, [editorArticlesData]); // <--- Dependency array: rerun when authorArticlesData changes
    // ---------------------------------------------------------------

    if (editorArticlesLoading) {
        return <h3 style={{
            padding: "30px", display: 'flex',
            justifyContent: 'center'
        }}>
            Loading...</h3>;
    }

    if (editorArticlesError) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    return (
        <div style={{ padding: '30px' }}>
            <div >
                <h1>Review History</h1>
                <hr />
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        current: page,
                        pageSize,
                        total: editorArticlesData?.totalCount, // Optional if backend provides total count
                        onChange: (page) => {
                            setPage(page);
                        },
                        position: 'bottom',
                        align: 'center',
                        showQuickJumper: true,
                        showSizeChanger: false,
                    }}
                    dataSource={displayedArticles}
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            extra={
                                <img
                                    // width={272}
                                    height={200}
                                    // style={{ borderRadius: "10px" }}
                                    alt="logo"
                                    src={item.cover_img_link}
                                />
                            }
                        >
                            <List.Item.Meta
                                // avatar={<Avatar src={item.avatar} />}
                                title={
                                    <div>
                                        {item.category_name} {'>'} {item.subcategory_name}
                                        <br />
                                        {/* Conditional rendering based on item.href */}
                                        {item.href !== "" ? (
                                            // If item.href is NOT empty, render the Link
                                            <Link to={item.href}>
                                                <span style={{
                                                    fontSize: '18px', fontWeight: 'bold',
                                                    color: '#000'
                                                }}>
                                                    {item.title}
                                                </span>
                                            </Link>
                                        ) : (
                                            // If item.href IS empty, render only the span (non-clickable)
                                            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                                                {item.title}
                                            </span>
                                        )}
                                    </div>}
                                description={item.description}
                            />
                            <span style={{ fontSize: '16px' }}>{item.content}</span>
                            <hr />
                            Status: {item.status === "approved" &&
                                <b style={{ color: 'green', fontSize: '16px' }}>
                                    Approved <i className="fa-solid fa-circle-check"></i> </b>}

                            {item.status === "rejected" &&
                                <b style={{ color: 'red', fontSize: '16px' }}>
                                    Rejected <i className="fa-solid fa-circle-xmark"></i> </b>}

                            {item.status.split('_').slice(0, 2).join('_') === "under_review" &&
                                <b style={{ color: '#103B7F', fontSize: '16px' }}>
                                    {/* if it's under_review_edit_1 etc, then seperate the last number */}
                                    Under Review {item.status !== "under_review_new" &&
                                        `(Round ${parseInt(item.status.match(/\d+$/)[0], 10)})`}
                                    &nbsp; <i className="fa-solid fa-circle-exclamation"></i> </b>
                            }

                            {item.status.split('_').slice(0, -1).join('_') === "sent_for_edit" &&
                                <b style={{ color: '#B71C1C', fontSize: '16px' }}>
                                    Edit Requested (Round {item.status.split('_')[item.status.split('_').length - 1]})
                                    &nbsp;<i className="fa-solid fa-square-pen"></i> </b>
                            }
                        </List.Item>
                    )}
                />

            </div>
        </div>
    );
}

export default EditorReviewHistory;