import React, { useState, useEffect } from 'react';
import { Avatar, List, Radio, Space } from 'antd';
import { useQuery } from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { LikeOutlined, MessageOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import { getFormattedTime } from '../../../utils/dateUtils';
import { Link } from 'react-router-dom';
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../../../css/Notification.module.css'

const fetchData = async (url, axiosInstance) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

const EditorNotifications = () => {
    const [page, setPage] = useState(1);
    const pageSize = 2;

    const ALL_EDITOR_NOTIS_URL = `/api/v1/notification/notifcation_list/editor?page=${page}&limit=${pageSize}`
    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: editorNotisData, error: editorNotisError,
        isLoading: editorNotisLoading } = useQuery(
            ['editorNotisData', ALL_EDITOR_NOTIS_URL],
            () => fetchData(ALL_EDITOR_NOTIS_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    // --- New state to hold the data formatted for display ---
    const [displayedNotis, setDisplayedNotis] = useState([]);
    // -------------------------------------------------------

    // --- useEffect to process data when editorNotisData changes ---
    useEffect(() => {
        //  console.log("editorNotisData changed, processing...");
        // This code runs whenever editorNotisData changes (including initial load)
        const processedData = editorNotisData?.all_notis?.map(notis => ({
            title: notis.notification_title,
            title_color: notis.notification_title_color || "gray",
            link: `${notis.notification_link}?notification=true&id=${notis.notification_id}` || "",
            icon: notis.notification_icon || "!",
            avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=1`,
            description: notis.notification_text,
            time: notis.notification_time,
            is_clicked: notis.is_clicked,
        })) || [];

        // Update the state with the processed data
        setDisplayedNotis(processedData);

    }, [editorNotisData]); // <--- Dependency array: rerun when editorNotisData changes
    // ---------------------------------------------------------------

    if (editorNotisLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }

    const renderHTMLContent = (content) => {
        return { __html: content };  // Prepare the HTML content for rendering
    };


    return (
        <div style={{
            padding: "40px 0 0 20px",
            // backgroundColor: "red",
            width: "90vw"
        }}
        >
            <h1>Editor Notifications</h1>
            <hr />
            <div>
                {editorNotisLoading ? "Loading..." :
                    editorNotisError ? (
                        <span style={{
                            display: 'flex', justifyContent: 'center',
                            color: 'red', fontWeight: 'bold', fontSize: '30px'
                        }}>
                            Server Error!</span>) :
                        <List
                            itemLayout="vertical"
                            pagination={{
                                current: page,
                                pageSize,
                                total: editorNotisData?.totalCount,
                                onChange: (page) => {
                                    setPage(page);
                                },
                                position: 'bottom',
                                align: 'center',
                                showQuickJumper: true,
                                showSizeChanger: false,
                            }}
                            // dataSource={editorNotisDataDisplay} displayedNotis
                            dataSource={displayedNotis}

                            renderItem={(item, index) => (
                                <List.Item
                                    className={styles.notificationListItem}
                                    style={{ backgroundColor: item.is_clicked ? "#F7F8FA" : "#d5eaf1" }}
                                    actions={[
                                        <span style={{ paddingLeft: "45px", fontSize: "14px", }}>
                                            <AccessTimeTwoToneIcon fontSize='small' /> {getFormattedTime(item.time)}</span>
                                    ]}
                                >
                                    {/* <i className="fa-solid fa-file-circle-exclamation"></i> */}
                                    <List.Item.Meta
                                        // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                        avatar={<div style={{ fontSize: "25px", color: `${item.title_color}` }}>
                                            <div dangerouslySetInnerHTML=
                                                {renderHTMLContent(item.icon)} /> </div>}
                                        title={
                                            <span style={{ fontSize: "18px", color: `${item.title_color}` }}>
                                                <b> {item.link && <Link to={item.link}>
                                                    <span style={{ color: `${item.title_color}` }} className={styles.notisTitle}>
                                                        {item.title} </span> </Link>}
                                                    <span style={{ color: `${item.title_color}` }} className={styles.notisTitle}>
                                                        {!item.link && item.title} </span>
                                                </b>
                                            </span>
                                        }
                                        description={<span style={{ fontSize: "16px", color: "black" }}>
                                            <div dangerouslySetInnerHTML=
                                                {renderHTMLContent(item.description)} />
                                            {/* {item.description} */}
                                        </span>}
                                    />
                                </List.Item>
                            )}
                        />
                }
            </div>

        </div>
    );
}

export default EditorNotifications;