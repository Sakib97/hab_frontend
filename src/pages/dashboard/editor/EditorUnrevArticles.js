import { Avatar, List, Space } from 'antd';
import React, { useState } from 'react';

import useAuth from '../../../hooks/useAuth';
import { useQuery } from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import { getFormattedTime } from '../../../utils/dateUtils';
import { fetchData } from '../../../utils/getDataUtil';

// const fetchData = async (url, axiosInstance) => {
//     const response = await axiosInstance.get(url);
//     return response.data;
// };

const EditorUnrevArticles = () => {
    const { auth } = useAuth()

    // for loading new articles only when new page 
    // (from pagination) is being loaded
    const [page, setPage] = useState(1);
    const pageSize = 2;


    const editor_mail = auth?.email
    // const UNREVIEWED_ARTICLES_URL = '/api/v1/article/unrev_article_by_editor_mail/' + editor_mail
    const UNREVIEWED_ARTICLES_URL = `/api/v1/article/unrev_article_by_editor_mail/${editor_mail}?page=${page}&limit=${pageSize}`;
    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: unrevData, error: unrevError,
        isLoading: unrevLoading } = useQuery(
            ['unrevArticleData', UNREVIEWED_ARTICLES_URL, page],
            () => fetchData(UNREVIEWED_ARTICLES_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 60000,  // Example option: Cache data for 60 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );
    // console.log("unrevData:: ", unrevData);

    const unredDataDisplay = unrevData?.articles?.map(article => ({
        href: `/editor_dashboard/review/article-review/${article.article_id}`,
        title: article.title_en,
        avatar: article.author_image_url,
        description: `${article.author_firstname} ${article.author_lastname} || ${getFormattedTime(article.submitted_at)}`,
        content: article.subtitle_en,
        cover_img_link: article.cover_img_link,
        status: article.status,
        article
    })) || [];


    // console.log("unredDataDisplay:: ", unredDataDisplay);
    return (
        <div style={{
            padding: "5px 20px 20px 20px",
            // backgroundColor: "red",
            width: "100vw",
            display: "flex", justifyContent: "center",
        }}>
            {unrevLoading ? "Loading..." :
                unrevError ? "Server Error ! " :
                    <List
                        itemLayout="vertical"
                        size="large"

                        pagination={{
                            current: page,
                            pageSize,
                            total: unrevData?.totalCount, // Optional if backend provides total count
                            // total: 10, // Optional if backend provides total count
                            onChange: (page) => {
                                // console.log("Current page:", page);
                                setPage(page);
                            }, // Update page state
                            align: 'center',
                            showQuickJumper: true,
                            showSizeChanger: false,
                        }}
                        dataSource={unredDataDisplay}
                        renderItem={(item) => (
                            <List.Item

                                key={item.title}
                                extra={
                                    <img
                                        // width={212}
                                        height={200}
                                        alt="logo"
                                        src={item.cover_img_link}
                                    />
                                }
                            >
                                <List.Item.Meta

                                    avatar={<Avatar src={item.avatar} />}
                                    title={<Link to={item.href}
                                        state={{ article: item.article }}>
                                        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{item.title}</span>
                                        </Link>}
                                    description={item.description}
                                />
                                <span style={{ fontSize: '16px' }}>{item.content}</span>
                                <hr />
                                {/* Status: <b>{item.status} </b> */}
                                Status: &nbsp;
                                {item.status.split('_').slice(0, 2).join('_') === "under_review" &&
                                    <b style={{ color: '#103B7F', fontSize: '16px' }}>
                                        {/* if it's under_review_edit_1 etc, then seperate the last number */}
                                        Under Review {item.status !== "under_review_new" &&
                                            `(Round ${parseInt(item.status.match(/\d+$/)[0], 10)})`}
                                        &nbsp;<i className="fa-solid fa-circle-exclamation"></i> </b>}
                            </List.Item>
                        )}
                    />
            }
        </div>
    );
}

export default EditorUnrevArticles;