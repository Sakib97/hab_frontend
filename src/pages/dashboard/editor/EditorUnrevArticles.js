import { LikeOutlined, MessageOutlined, StarOutlined } from '@ant-design/icons';
import { Avatar, List, Space } from 'antd';
import React from 'react';
import useAuth from '../../../hooks/useAuth';
import { useQuery } from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';


// const data = Array.from({
//     length: 23,
// }).map((_, i) => ({
//     href: 'https://ant.design',
//     title: `ant design part ${i}`,
//     avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
//     description:
//         'Ant Design, a design language for background applications, is refined by Ant UED Team.',
//     content:
//         'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
// }));
// const IconText = ({ icon, text }) => (
//     <Space>
//         {React.createElement(icon)}
//         {text}
//     </Space>
// );

const fetchData = async (url, axiosInstance) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

const EditorUnrevArticles = () => {
    const { auth } = useAuth()
    const editor_mail = auth?.email
    const UNREVIEWED_ARTICLES_URL = '/api/v1/article/unrev_article_by_editor_mail/' + editor_mail
    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: unrevData, error: unrevError,
        isLoading: unrevLoading } = useQuery(
            ['unrevArticleData', UNREVIEWED_ARTICLES_URL],
            () => fetchData(UNREVIEWED_ARTICLES_URL, axiosInst),
            {
                staleTime: 60000,  // Example option: Cache data for 60 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );
    // console.log("unrevData:: ", unrevData);

    const unredDataDisplay = Array.from({ length: unrevData?.length }).map((_, i) => ({
        // href: 'https://ant.design', // /editor_dashboard/review/

        href: '/editor_dashboard/review/article-review',
        title: unrevData[i].title_en, // Map title with title_en from API response
        avatar: unrevData[i].author_image_url, // Map avatar with author_image_url from API response
        description: unrevData[i].author_firstname + " " + unrevData[i].author_lastname + " || " + unrevData[i].submitted_at,
        content: unrevData[i].subtitle_en, // Map content with content_en from API response
        // content: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Exercitationem impedit ea numquam fuga beatae rem asperiores sit optio sint, illum, laboriosam esse, animi reiciendis tempora ipsam quae iusto eius deleniti quisquam laudantium voluptate a. Minima sunt laborum aperiam aliquid assumenda, accusamus nam vel totam, officiis voluptates fugiat laboriosam eveniet at.",
        cover_img_link: unrevData[i].cover_img_link,
        status: unrevData[i].status,
        article: unrevData[i]
    }));
    // console.log("unredDataDisplay:: ", unredDataDisplay);



    return (
        <div style={{
            padding: "20px",
            // display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            {/* <h1>Unreviewd articles</h1> */}
            {/* Loading Icon goed here */}

            {unrevLoading ? "Loading..." :
                unrevError ? "Server Error ! " :
                    <List
                        itemLayout="vertical"
                        size="large"
                        pagination={{
                            onChange: (page) => {
                                console.log(page);
                            },
                            pageSize: 3,
                            align: 'center'
                        }}
                        // dataSource={data}
                        dataSource={unredDataDisplay}
                        // footer={
                        //     <div>
                        //         <b>ant design</b> footer part
                        //     </div>
                        // }
                        renderItem={(item) => (
                            <List.Item

                                key={item.title}
                                // actions={[
                                //     <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
                                //     <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
                                //     <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
                                // ]}
                                extra={
                                    <img
                                        width={212}
                                        alt="logo"
                                        // src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                                        // src="https://i.imgur.com/Hu9L5RH.jpg" https://ibb.co.com/r3SZW7k
                                        // src="https://i.ibb.co.com/v3bscpR/home.jpg"
                                        src={item.cover_img_link}
                                    />
                                }
                            >
                                <List.Item.Meta

                                    avatar={<Avatar src={item.avatar} />}
                                    // title={<Link to={item.href}>{item.title}</Link>}
                                    // title={<Link
                                    //     to={{ pathname: item.href, state: { article: item.article } }}>
                                    //     {item.title}</Link>}
                                    title={<Link to={item.href}
                                         state={{ article: item.article }}>
                                        {item.title}</Link>}
                                    description={item.description}
                                />
                                {item.content}
                                <hr />
                                Status: <b>{item.status} </b>
                            </List.Item>
                        )}
                    />
            }
        </div>
    );
}

export default EditorUnrevArticles;