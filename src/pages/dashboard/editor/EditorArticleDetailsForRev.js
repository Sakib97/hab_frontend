import { useLocation } from 'react-router-dom';
import styles from '../../../css/EditorArticleDetailsForRev.module.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import Divider from '@mui/material/Divider';
import { Button, Tooltip } from "antd";
import LanguageToggle from '../../../components/LanguageToggle';
import { Input } from 'antd';
const { TextArea } = Input;

const EditorArticleDetailsForRev = () => {
    const [newTag, setNewTag] = useState(false)
    const [tagsList, setTagsList] = useState([])
    const [submittedAt, setSubmittedAt] = useState()

    const [isAcceptable, setIsAcceptable] = useState(true)
    const [isReviseable, setIsReviseable] = useState(false)
    const [isRejectable, setIsRejectable] = useState(false)
    const [reviseReason, setReviseReason] = useState('')
    const [rejectReason, setRejectReason] = useState('')

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

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
        const buttonName = clickedButton.name; // The name of the button

        if (buttonName === 'revision') {
            setIsRejectable(false)
            setIsReviseable(true)
            setIsAcceptable(false)
        }
        if (buttonName === 'reject') {
            setIsReviseable(false)
            setIsRejectable(true)
            setIsAcceptable(false)
        }
        if (buttonName === 'revisionCancel') {
            setRejectReason('')
            setReviseReason('')
            setIsReviseable(false)
            setIsRejectable(false)
            setIsAcceptable(true)
        }
        if (buttonName === 'rejectCancel') {
            setRejectReason('')
            setReviseReason('')
            setIsReviseable(false)
            setIsRejectable(false)
            setIsAcceptable(true)
        }
    }

    const renderHTMLContent = (content) => {
        return { __html: content  };  // Prepare the HTML content for rendering
    };


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

                    <span className={styles.subcategory}>
                        Sub-category: <strong>{article.subcategory_name}</strong></span>

                    <span className={styles.tagRequest}>
                        {newTag && <span>New Tag Request: </span>}
                        {!newTag && <span>Tags: </span>}
                        {tagsList.map((tag, index) => (
                            <Badge pill bg="dark" key={index} className="me-2">
                                {tag}
                            </Badge>
                        ))}
                        {newTag && <span>
                            <br />
                            <Tooltip title="Accept">
                                <Button size='small'
                                    // style={{ color: "black", border: "solid", borderWidth: "1px" }} 
                                    shape="circle"
                                    icon={<CheckCircleTwoToneIcon style={{ color: "green" }} fontSize="small" />} />
                            </Tooltip> &nbsp;
                            <Tooltip title="Decline">
                                <Button size='small'
                                    // style={{ color: "black", border: "solid", borderWidth: "1px" }}
                                    shape="circle"
                                    icon={<CancelTwoToneIcon style={{ color: "red", fontSize: '20px' }} />} />
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
                    <Divider style={{ backgroundColor: "black" }} orientation="vertical" flexItem />
                    <Divider style={{ backgroundColor: "black" }} orientation="vertical" flexItem />


                    <span className={styles.date}>{submittedAt}</span>
                </div>

                <hr className={styles.divider} />
                Article Status: <b>{article.status}</b>
            </div>
            <hr />

            <div className={styles.articleContainer}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                    <LanguageToggle onToggle={handleLanguageToggle} />
                </div>
                <div>
                    <img src={article.cover_img_link} alt="cover_image" />
                </div>
                <div style={{ display: "flex", justifyContent: "center" }} >

                    {isEnglish && <span>Caption: {article.cover_img_cap_en}</span>}
                    {!isEnglish && <span className='bn2'>শিরোনাম : {article.cover_img_cap_bn}</span>}

                </div>
                <div>
                    {isEnglish && <span><b>{article.subtitle_en}</b></span>}
                    {!isEnglish && <strong><span className='bn'>{article.subtitle_bn}</span></strong>}

                </div>
                <hr className={styles.divider} />
                <div>
                    {/* {isEnglish && <span>{article.content_en}</span>} */}
                    {isEnglish && <div
                        dangerouslySetInnerHTML={renderHTMLContent(article.content_en)}  // Render the HTML content
                    />}

                    {!isEnglish &&
                        <div>
                            <div
                                dangerouslySetInnerHTML={renderHTMLContent(article.content_bn)}
                            />
                        </div>
                    }
                </div>
            </div>
            <hr />

            <form onSubmit={handleSubmit}>
                <div className={styles.articleContainer}>
                    {isReviseable &&
                        <div>
                            <textarea placeholder="Specify Revisions *"
                                rows="3"
                                cols="35"
                                style={{
                                    backgroundColor: "#ede5d5",
                                    borderRadius: "10px",
                                    borderStyle: "solid",
                                    borderWidth: "3px",
                                    borderColor: "#b59607",
                                }}
                                value={reviseReason}
                                onChange={(e) => setReviseReason(e.target.value)}
                                type="text" />
                            <br />
                            <br />

                            <button style={{ borderRadius: "20px" }}
                                name='revisionCancel'
                                className="btn btn-danger" >
                                <i className="fa-solid fa-xmark" />
                            </button>
                            &nbsp;
                            <button style={{ borderRadius: "20px" }}
                                name='revisionOK'
                                disabled={!reviseReason}
                                className="btn btn-success" >
                                <i className="fa-solid fa-check" />
                            </button>
                        </div>
                    }

                    {isRejectable &&
                        <div>
                            <textarea placeholder="Specify Rejection Reasons *"
                                rows="3"
                                cols="35"
                                style={{
                                    backgroundColor: "#eddada",
                                    borderRadius: "10px",
                                    borderStyle: "solid",
                                    borderWidth: "3px",
                                    borderColor: "#c20808"
                                }}
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                type="text" />
                            <br />
                            <br />

                            <button style={{ borderRadius: "20px" }}
                                name='rejectCancel'
                                className="btn btn-danger" >
                                <i className="fa-solid fa-xmark" />
                            </button>
                            &nbsp;
                            <button style={{ borderRadius: "20px" }}
                                disabled={!rejectReason}
                                name='rejectOK'
                                className="btn btn-success" >
                                <i className="fa-solid fa-check" />
                            </button>
                        </div>
                    }

                    {(isAcceptable && (!isReviseable || !isRejectable)) &&
                        <button style={{ margin: "4px" }}
                            name='accept'
                            className='btn btn-success'>
                            <AssignmentTurnedInOutlinedIcon /> Publish Article
                        </button>}
                    &nbsp;

                    {(!isReviseable && !isRejectable) &&
                        <button style={{ margin: "4px" }} name='revision'
                            className='btn btn-warning'>
                            <LowPriorityOutlinedIcon /> Send for Revision
                        </button>}
                    &nbsp;

                    {(!isReviseable && !isRejectable) &&
                        <button style={{ margin: "4px" }}
                            name='reject'
                            className='btn btn-danger'>
                            <BlockOutlinedIcon />  Reject Article
                        </button>}
                </div>

            </form>




        </div>

        // </div>
    );
}

export default EditorArticleDetailsForRev;