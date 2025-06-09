import { useEffect, useState } from 'react';
import { Avatar, List, Radio, Space } from 'antd';
import { fetchData } from '../../utils/getDataUtil';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { getFormattedTime } from '../../utils/dateUtils';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import styles from '../../css/Notification.module.css';

const ProfileNotification = () => {
    const [page, setPage] = useState(1);
    const pageSize = 2;
    const ALL_GENERAL_NOTIS_URL = `/api/v1/notification/notifcation_list/general?page=${page}&limit=${pageSize}`
    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: generalNotisData, error: generalNotisError,
        isLoading: generalNotisLoading } = useQuery(
            ['generalNotisData', ALL_GENERAL_NOTIS_URL],
            () => fetchData(ALL_GENERAL_NOTIS_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );
    // --- New state to hold the data formatted for display ---
    const [displayedNotis, setDisplayedNotis] = useState([]);

    // for notifications for new notes
    // const [noteNotification, setNoteNotification] = useState(false);
    // const [noteTargetMail, setNoteTargetMail] = useState('');
    // -------------------------------------------------------

    // --- useEffect to process data when editorNotisData changes ---
    useEffect(() => {
        // This code runs whenever editorNotisData changes (including initial load)
        const processedData = generalNotisData?.all_notis?.map(notis => {
            // check if notification is for new note
            // const notis_type_parts = notis?.notification_type?.split('_');
            // const new_note_part = notis_type_parts?.slice(0, 2).join('_');
            // if (new_note_part === 'new_note') {
            //     setNoteNotification(true); // Set noteNotification to true if new note notification
            //     const emailIndex = notis?.notification_type?.indexOf('_sender_');
            //     const targetEmail = notis?.notification_type?.slice(emailIndex + '_sender_'.length);
            //     console.log("targetEmailnotis:: ", targetEmail);
                
            //     setNoteTargetMail(targetEmail); // Extract the target email from the notification type
            // } else {
            //     setNoteNotification(false); // Set noteNotification to false for other types
            // }


            // Function to construct the notification link
            const constructNotificationLink = (notificationLink, notificationId) => {
                const hasQueryString = notificationLink?.includes('?'); // Check if the link already has a query string
                const queryParams = `notification=true&id=${notificationId}&type=general`; // Additional query parameters
                return hasQueryString
                    ? `${notificationLink}&${queryParams}` // Append with '&' if there's already a query string
                    : `${notificationLink}?${queryParams}`; // Append with '?' if there's no query string
            };

            return {
                title: notis.notification_title,
                title_color: notis.notification_title_color || "gray",
                link: constructNotificationLink(notis?.notification_link, notis?.notification_id), // Use the constructed link
                icon: notis.notification_icon || "!",
                avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=1`,
                description: notis.notification_text,
                time: notis.notification_time,
                is_clicked: notis.is_clicked,
            };
        }) || [];

        // Update the state with the processed data
        setDisplayedNotis(processedData);

    }, [generalNotisData]); // <--- Dependency array: rerun when editorNotisData changes
    // ---------------------------------------------------------------
    if (generalNotisLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }

    if (generalNotisError) {
        return <h3 style={{
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    const renderHTMLContent = (content) => {
        return { __html: content };  // Prepare the HTML content for rendering
    };

    return (
        <div style={{
            width: "100%",
            padding: "20px",
            // backgroundColor: "gray"
        }}>
            <h1> Notifications </h1>
            <hr />
            <div style={{}}>
                <List
                    itemLayout="vertical"
                    pagination={{
                        current: page,
                        pageSize,
                        total: generalNotisData?.totalCount, // Optional if backend provides total count
                        onChange: (page) => {
                            setPage(page);
                        }, // Update page state
                        position: 'bottom',
                        align: 'center',
                        showQuickJumper: true,
                        showSizeChanger: false,
                    }}
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
                            <List.Item.Meta
                                avatar={<div style={{ fontSize: "25px", color: `${item.title_color}` }}>
                                    <div dangerouslySetInnerHTML=
                                        {renderHTMLContent(item.icon)} /> </div>}
                                title={
                                    <span style={{ fontSize: "18px", color: `${item.title_color}` }}>
                                        <b> {item.link &&
                                            <Link to={item.link}
                                                // Pass targetUsermail as state if noteNotification is true
                                                // because note details require targetUsermail as state
                                                // {...(noteNotification && noteTargetMail &&
                                                    // { state: { targetUsermail: noteTargetMail } })}
                                            >
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
            </div>
        </div>
    );
}

export default ProfileNotification;