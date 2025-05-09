import React from 'react';
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import { fetchData } from '../../utils/getDataUtil';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useQuery } from 'react-query';
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { getFormattedTime } from '../../utils/dateUtils';
import { Link, Outlet, useLocation } from 'react-router-dom';

const ProfileMyArticle = () => {
    const { auth } = useAuth()
    const author_mail = auth?.email
    const [page, setPage] = useState(1);
    const pageSize = 2;

    const location = useLocation();
    const basePath = '/profile/my_articles';
    const isBaseRoute = location.pathname === basePath;
    const isDetailsRoute = location.pathname.startsWith(`${basePath}/details`);
    // console.log("location.pathname:: ", location.pathname);
    // console.log("isBaseRoute:: ", isBaseRoute);
    // console.log("isDetailsRoute:: ", isDetailsRoute);


    const ALL_AUTHOR_ARTICLE_URL = `/api/v1/article/all_article_by_email/author/${author_mail}?page=${page}&limit=${pageSize}`

    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    const { data: authorArticlesData, error: authorArticlesError,
        isLoading: authorArticlesLoading } = useQuery(
            ['authorArticlesData', ALL_AUTHOR_ARTICLE_URL],
            () => fetchData(ALL_AUTHOR_ARTICLE_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );
    // --- New state to hold the data formatted for display ---
    const [displayedArticles, setDisplayedArticles] = useState([]);

    // -------------------------------------------------------
    // --- useEffect to process data when authorArticlesData changes ---
    useEffect(() => {
        //  console.log("authorArticlesData changed, processing...");
        // This code runs whenever authorArticlesData changes (including initial load)
        const processedData = authorArticlesData?.articles?.map(article => ({
            href: `/profile/my_articles/details?a_id=${article.article_id}`,
            title: article.title_en,
            status: article.article_status,
            description: `Submission Time: ${getFormattedTime(article.submitted_at)}`,
            content: article.subtitle_en,
            cover_img_link: article.cover_img_link,
            // article
        })) || [];

        // Update the state with the processed data
        setDisplayedArticles(processedData);

    }, [authorArticlesData]); // <--- Dependency array: rerun when authorArticlesData changes
    // ---------------------------------------------------------------

    if (authorArticlesLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }

    if (authorArticlesError) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    return (
        <div style={{ padding: "20px" }}>
            {isBaseRoute && <div >
                <h1>My Articles</h1>
                <hr />
                <List
                    itemLayout="vertical"
                    size="large"
                    pagination={{
                        current: page,
                        pageSize,
                        total: authorArticlesData?.totalCount, // Optional if backend provides total count
                        onChange: (page) => {
                            setPage(page);
                        },
                        position: 'bottom',
                        align: 'center',
                        showQuickJumper: true,
                        showSizeChanger: false,
                    }}
                    dataSource={displayedArticles}
                    // footer={
                    //     <div>
                    //         <b>ant design</b> footer part
                    //     </div>
                    // }
                    renderItem={(item) => (
                        <List.Item
                            key={item.title}
                            // actions={[
                            //     <span style={{ paddingLeft: "45px", fontSize: "14px", }}>
                            //         <AccessTimeTwoToneIcon fontSize='small' /> {getFormattedTime(item.time)}</span>
                            // ]}
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
                                title={<Link to={item.href}>

                                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.title}</span>
                                </Link>}
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
                                    `(Round ${parseInt(item.status.match(/\d+$/)[0] , 10)})`}  
                                    &nbsp; <i className="fa-solid fa-circle-exclamation"></i> </b>}

                            {item.status.split('_').slice(0, -1).join('_') === "sent_for_edit" &&
                                <b style={{ color: '#B71C1C', fontSize: '16px' }}>
                                    Edit Requested (Round {item.status.split('_')[item.status.split('_').length - 1] })  
                                    &nbsp;<i className="fa-solid fa-square-pen"></i> </b>
                            }
                        </List.Item>
                    )}
                />

            </div>}

            {isDetailsRoute && <div>
                <Outlet />
            </div>}
        </div>
    );
}

export default ProfileMyArticle;