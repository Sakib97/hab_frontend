import React, { useState } from 'react';
import { Avatar, List, Radio, Space } from 'antd';
import { useQuery } from 'react-query';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { LikeOutlined, MessageOutlined, StarOutlined, ClockCircleOutlined } from '@ant-design/icons';
import AccessTimeTwoToneIcon from '@mui/icons-material/AccessTimeTwoTone';
import { getFormattedTime } from '../../../utils/dateUtils';
import { Link } from 'react-router-dom';

const fetchData = async (url, axiosInstance) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

// const data = [
//     {
//         title: 'Ant Design Title 1',
//     },
//     {
//         title: 'Ant Design Title 2',
//     },
//     {
//         title: 'Ant Design Title 3',
//     },
//     {
//         title: 'Ant Design Title 4',
//     },
// ];

// const IconText = ({ icon, text }) => (
//     <Space>
//         {React.createElement(icon)}
//         {text}
//     </Space>
// );


const EditorNotifications = () => {
    const ALL_EDITOR_NOTIS_URL = '/api/v1/notification/editor_notifcation_list'
    const [position, setPosition] = useState('bottom');
    const [align, setAlign] = useState('center');

    const axiosPrivate = useAxiosPrivate();

    const axiosInst = axiosPrivate;
    const { data: editorNotisData, error: editorNotisError,
        isLoading: editorNotisLoading } = useQuery(
            ['editorNotisData', ALL_EDITOR_NOTIS_URL],
            () => fetchData(ALL_EDITOR_NOTIS_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                staleTime: 60000,  // Example option: Cache data for 60 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const editorNotisDataDisplay = editorNotisData?.all_notis?.map(notis => ({
        title: notis.notification_title,
        title_color: notis.notification_title_color || "gray",
        link: notis.notification_link || "",
        icon: notis.notification_icon || `<i className="fa-solid fa-triangle-exclamation"></i>`,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=1`,
        description: notis.notification_text,
        time: notis.notification_time
    })) || [];

    const renderHTMLContent = (content) => {
        return { __html: content };  // Prepare the HTML content for rendering
    };


    return (
        <div style={{
            padding: "35px",
            // backgroundColor: "red",
            width: "100vw"
        }}
        >
            <h1>Editor Notifications</h1>
            <hr />
            <div >
                <List
                    itemLayout="vertical"
                    pagination={{
                        position,
                        align,
                    }}
                    dataSource={editorNotisDataDisplay}
                    renderItem={(item, index) => (
                        <List.Item
                            actions={[
                                <span style={{ paddingLeft: "45px" ,fontSize: "14px" }}>
                                    <AccessTimeTwoToneIcon fontSize='small' /> {getFormattedTime(item.time)}</span>
                            ]}
                        >
                            {/* <i className="fa-solid fa-file-circle-exclamation"></i> */}
                            <List.Item.Meta
                                // avatar={<Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`} />}
                                avatar={<div style={{ fontSize: "25px" }}> 
                                <div dangerouslySetInnerHTML=
                                    {renderHTMLContent(item.icon)} /> </div>}
                                title={
                                    <span style={{ fontSize: "18px", color: `${item.title_color}` }}>
                                        <b> {item.link && <Link to={item.link}>{item.title}</Link>}
                                            {!item.link && item.title}
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

export default EditorNotifications;