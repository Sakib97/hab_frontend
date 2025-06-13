import styles from "../../css/UserProfile.module.css";
import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { fetchData } from "../../utils/getDataUtil";
import axios from "../../api/axios";
import { useQuery } from "react-query";
import { getRoleBadges } from "../../utils/roleUtil";
import { getFormattedTime, getOnlyYear } from "../../utils/dateUtils";
import { xorEncode } from "../../utils/encodeUtil";
import { slugify } from "../../utils/slugAndStringUtil";
import { timeAgo } from "../../utils/dateUtils";

const UserProfile = () => {
    const { userSlug } = useParams();
    const [page, setPage] = useState(1);
    const pageSize = 2;

    const GET_USER_PROFILE_URL = `/api/v1/user/get_user_and_articles/${userSlug}`;
    // const GET_USER_PROFILE_URL = `/api/v1/user/get_user_and_articles/${xorEncode(userSlug)}`;
    const GET_USER_ARTICLES_URL = `/api/v1/article/articles_by_user/${userSlug}?page=${page}&limit=${pageSize}`;
    const axiosInst = axios;

    const { data: userAndArticleData, error: userAndArticleError,
        isLoading: userAndArticleLoading } = useQuery(
            ['userAndArticleData', GET_USER_PROFILE_URL],
            () => fetchData(GET_USER_PROFILE_URL, axiosInst),
            {
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const { data: userArticlesData, error: userArticlesError,
        isLoading: userArticlesLoading } = useQuery(
            ['userArticlesData', GET_USER_ARTICLES_URL],
            () => fetchData(GET_USER_ARTICLES_URL, axiosInst),
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
        const processedData = userArticlesData?.articles?.map(article => ({
            href: `/${slugify(article.category_name)}/${slugify(article.subcategory_name)}/article/${article.article_id}/${slugify(article.title)}`,
            title: article.title,
            description: `${timeAgo(article.published_at)}`,
            content: article.subtitle,
            cover_img_link: article.cover_img_link,
            category_name: article.category_name,
            subcategory_name: article.subcategory_name,
            // article
        })) || [];

        // Update the state with the processed data
        setDisplayedArticles(processedData);

    }, [userArticlesData]); // <--- Dependency array: rerun when authorArticlesData changes
    // ---------------------------------------------------------------

    if (userAndArticleLoading) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            fontSize: '30px'
        }}>Loading...</h3>;
    }

    if (userAndArticleError) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    return (
        <div style={{
            marginTop: "20px",
            marginBottom: "20px",
        }}
            className="container">

            <div className={styles.profileContainer}>
                <img className={styles.profileImage} src={userAndArticleData?.image_url} alt="" />

                <div className={styles.profileDetails}>
                    <div style={{ fontSize: "24px", fontWeight: "bold" }}>
                        {userAndArticleData?.first_name} {userAndArticleData?.last_name}
                    </div>
                    <div style={{ display: "flex" }}>
                        {getRoleBadges(userAndArticleData?.roles)}
                    </div>
                    <div style={{ color: "gray", fontSize: "14px" }}>
                        Joined in {getOnlyYear(userAndArticleData?.created_at)}
                    </div>
                </div>
            </div>

            <br />
            <hr />
            <br />


            <div className={styles.profileContent}>
                <h2>Articles</h2>
                <hr />
                {userArticlesError ? (
                    <div style={{ color: "red", fontSize: "18px" }}>
                        Error loading articles.
                    </div>
                ) : userArticlesLoading ? (
                    <div style={{ padding: "20px", fontSize: "18px" }}>
                        Loading articles...
                    </div>
                ) : userArticlesData?.articles?.length > 0 ? (
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            current: page,
                            pageSize,
                            total: userArticlesData?.article_count,
                            onChange: (page) => setPage(page),
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
                                        width={150}
                                        alt="cover"
                                        src={item.cover_img_link}
                                    />
                                }
                            >
                                <List.Item.Meta
                                    title={
                                        <div>
                                            {item.category_name} {'>'} {item.subcategory_name}
                                            <br />
                                            <Link to={item.href}>
                                                <span style={{ fontSize: '18px', fontWeight: 'bold', color: "black" }}>
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </div>
                                    }
                                    description={item.description}
                                />
                                {item.content}
                            </List.Item>
                        )}
                    />
                ) : (
                    <div style={{ padding: "20px", fontSize: "18px", color: "gray" }}>
                        No articles found.
                    </div>
                )}


            </div>

        </div>);
}

export default UserProfile;