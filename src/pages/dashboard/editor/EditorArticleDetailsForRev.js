import { useLocation } from 'react-router-dom';
import styles from '../../../css/EditorArticleDetailsForRev.module.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import { Button, Tooltip, Switch } from "antd";
import LanguageToggle from '../../../components/LanguageToggle';


const EditorArticleDetailsForRev = () => {
    const [newTag, setNewTag] = useState(false)
    const [tagsList, setTagsList] = useState([])
    const [submittedAt, setSubmittedAt] = useState()
    const location = useLocation();
    const article = location.state?.article;

    const [isEnglish, setIsEnglish] = useState(true);

    const handleLanguageToggle = (newIsEnglish) => {
        setIsEnglish(newIsEnglish);  // Update the parent's state based on the toggle
        // console.log('Language changed to:', newIsEnglish ? 'English' : 'Bengali');
    };

    useEffect(() => {
        if (!article || !article.tags || !article.submitted_at) {
            // Return early if article or tags is null or undefined
            return;
        }
        // Step 1: Remove the curly braces from the tag string
        const tags = article.tags;

        const cleanedTags = tags.replace(/{|}/g, '');

        // Step 2: Split the string by the comma
        const separatedWords = cleanedTags.split(',');
        const actualTags = separatedWords.slice(0, -1);
        setTagsList(actualTags)

        // Check if the last tag is 'newTagRequested' and update state if true
        const lastTag = separatedWords[separatedWords.length - 1];
        if (lastTag === "newTagRequested") {
            setNewTag(true);
        }

        const dateStr = article.submitted_at
        const date = new Date(dateStr);
        const formattedDate = date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        });
        const finalFormattedString = `${formattedDate}, ${formattedTime}`;
        setSubmittedAt(finalFormattedString)

    }, []);

    if (!article) {
        return <h3 style={{ padding: "30px", color: "red" }}>No article data found!</h3>;
    }
    // console.log("article::: ", article);
    // const avatarUrl = 'https://i.ibb.co.com/v3bscpR/home.jpg'


    return (
        // <div style={{
        //     // paddingLeft: "350px",
        //     // display: "flex"
        //     // position: "static"
        //     display: "flex", justifyContent: "center", alignItems: "center",
        //     // backgroundColor: "#e5f5f5"
        // }}>
        <div className={`${styles.outerContainer}`}>
            <div className={styles.articleContainer}>

                <h2 className={styles.title}> {article.title_en}</h2>
                <h3 className={`${styles.subtitle} bn`}>{article.title_bn}</h3>

                <div className={styles.infoRow}>
                    <span className={styles.category}>
                        Category: <strong>{article.category_name}</strong></span>
                    ||
                    <span className={styles.subcategory}>
                        Sub-category: <strong>{article.subcategory_name}</strong></span>
                    ||
                    <span className={styles.tagRequest}>
                        {newTag && <span>New Tag Request: </span>}
                        {!newTag && <span>Tags: </span>}
                        {tagsList.map((tag, index) => (
                            <Badge pill bg="dark" key={index} className="me-2">
                                {tag}
                            </Badge>
                        ))}

                        {newTag && <span>
                            <Tooltip title="Accept">
                                <Button size='small'
                                    style={{ color: "green" }} shape="circle"
                                    icon={<CheckCircleTwoToneIcon fontSize="small" />} />
                            </Tooltip>
                            <Tooltip title="Decline">
                                <Button size='small'
                                    style={{ color: "red" }} shape="circle"
                                    icon={<CancelTwoToneIcon style={{ fontSize: '20px' }} />} />
                            </Tooltip>
                        </span>}
                    </span>
                </div>

                <div className={styles.authorDate}>
                    <Avatar src={<img src={article.author_image_url} alt="avatar" />}
                        size={20} icon={<UserOutlined />} />
                    &nbsp;&nbsp;
                    <span className={styles.authorStatus}>
                        {article.author_firstname} {article.author_lastname}
                    </span>
                    <span className={styles.separator}>||</span>
                    <span className={styles.date}>{submittedAt}</span>
                </div>

                <hr className={styles.divider} />
                Article Status: <b>{article.status}</b>
            </div>
            <hr />
            {/* <div >
                <h2>Hello World</h2>
            </div> */}

            <div className={styles.articleContainer}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                    <LanguageToggle onToggle={handleLanguageToggle} />
                </div>
                <div>
                    <img src={article.cover_img_link} alt="cover_image" />
                </div>
                {/*  style={{display: "flex", flexDirection:"row"}} */}
                <div style={{ display: "flex", justifyContent: "center" }} >

                    {isEnglish && <span>Caption: {article.cover_img_cap_en}</span>}
                    {!isEnglish && <span className='bn'>শিরোনাম : {article.cover_img_cap_bn}</span>}

                </div>
                <div>
                    {isEnglish && <span><b>{article.subtitle_en}</b></span>}
                    {!isEnglish && <span className='bn'><b>{article.subtitle_bn}</b></span>}

                </div>
                <hr className={styles.divider} />
                <div>
                    {isEnglish && <span>{article.content_en}</span>}
                    {!isEnglish && <span className='bn'>{article.content_bn}</span>}
                </div>
            </div>



        </div>

        // </div>
    );
}

export default EditorArticleDetailsForRev;