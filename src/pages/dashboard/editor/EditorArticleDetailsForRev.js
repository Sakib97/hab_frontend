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
import Modal from 'react-bootstrap/Modal';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from 'react-query';

import { Input } from 'antd';
const { TextArea } = Input;

const postData = async (data, url, axiosInstance) => {
    const response = await axiosInstance.post(url,
        JSON.stringify(data),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
    return response;
}

const EditorArticleDetailsForRev = () => {
    const CREATE_TAG_API = '/api/v1/category/create_tag'
    const ADD_TAG_TO_ARTICLE_API = '/api/v1/article/add_tag_to_article'
    const [newTag, setNewTag] = useState(false)
    const [tagsList, setTagsList] = useState([])
    const [submittedAt, setSubmittedAt] = useState()

    const [isAcceptable, setIsAcceptable] = useState(true)
    const [isReviseable, setIsReviseable] = useState(false)
    const [isRejectable, setIsRejectable] = useState(false)
    const [reviseReason, setReviseReason] = useState('')
    const [rejectReason, setRejectReason] = useState('')

    const [tagExistsErrorMsg, setTagErrorMsg] = useState('')
    const [tagAddSuccess, setTagAddSuccess] = useState(false)

    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();
    const axiosInst = axiosPrivate;
    const { mutate: tagCreateMutate, isLoading: tagCreateIsLoading, isError: tagCreateIsError,
        isSuccess: tagCreateIsSuccess, data: tagCreateData } = useMutation(
            async (tag_obj) =>
                postData(tag_obj, CREATE_TAG_API, axiosInst), // Pass the data here
            {
                onSuccess: () => {
                    // Invalidate any queries you need to refetch after posting, if necessary
                    queryClient.invalidateQueries('createTag');
                },
                onError: (error) => {
                    console.error("Error creating Tag : ", error);
                },
            }
        );

    const { mutate: tagAddMutate, isLoading: tagAddIsLoading, isError: tagAddIsError,
        isSuccess: tagAddIsSuccess, data: tagAddData } = useMutation(
            async (add_tag_obj) =>
                postData(add_tag_obj, ADD_TAG_TO_ARTICLE_API, axiosInst), // Pass the data here
            {
                onSuccess: () => {
                    // Invalidate any queries you need to refetch after posting, if necessary
                    queryClient.invalidateQueries('addTag');
                },
                onError: (error) => {
                    console.error("Error adding Tag to article: ", error);
                },
            }
        );

    // for modal
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
    }
    const handleShow = () => {
        setShow(true);
    }

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

        const cleanedTags = tags.replace(/{|}|\[|\]|"|'/g, '');

        // Step 2: Split the string by the comma
        const separatedWords = cleanedTags.split(',');

        if (separatedWords.length > 1) {
            const lastTag = separatedWords[separatedWords.length - 1];

            // Check if the last tag is 'newTagRequested' and update state if true
            if (String(lastTag) === " newTagRequested") {
                setNewTag(true);
                const actualTags = separatedWords.slice(0, -1);
                // console.log("actualTags:: ", actualTags);    

                setTagsList(actualTags)
            } else {
                setTagsList(separatedWords)

            }
        } else {
            setTagsList(separatedWords)
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

    const tagCreate = () => {
        // console.log("tag OK button clicked !", tagsList[0]);
        const tag_obj = {
            "tag_name": tagsList[0],
            "tag_slug": tagsList[0]
        }
        tagCreateMutate(tag_obj, {
            onSuccess: (data) => {
                // console.log("API Response:", data.data.msg); 
                if (data?.data) {
                    const message = data.data.msg;
                    console.log("Tag created successfully 1!");
                    // toast.success(`Article submitted: ${data.data.msg}`, { duration: 5000 });
                } else {
                    // toast.success("Tag created successfully!", { duration: 5000 });
                    console.log("Tag created successfully 2!");

                }
            },
            onError: (error) => {
                const errorMessage = error.response.data.detail
                const extractedMessage = errorMessage.split(':').pop().trim();
                console.log("Error in submission:", extractedMessage);
                if (extractedMessage === "Tag already exists !") {
                    setTagErrorMsg(extractedMessage)
                }
                //   toast.error("Failed to submit article. Please try again.", { duration: 5000 });
            }
        });

    }

    const tagAddtoArticle = () => {
        console.log("tagAddtoArticle clicked");
        const tag_add_obj = {
            "article_id": article.article_id,
            "tag_name": article.tags
        }

        tagAddMutate(tag_add_obj, {
            onSuccess: (data) => {
                // console.log("API Response:", data.data.msg); 
                setTagAddSuccess(true)
                if (data?.data) {
                    const message = data.data.msg;
                    console.log("Tag added successfully 1!");
                    // toast.success(`Article submitted: ${data.data.msg}`, { duration: 5000 });
                } else {
                    // toast.success("Tag created successfully!", { duration: 5000 });
                    console.log("Tag Added successfully 2!");
                }
            },
            onError: (error) => {
                console.error("Error in tag add:", error);
                //   toast.error("Failed to submit article. Please try again.", { duration: 5000 });
            }
        });

    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
        const buttonName = clickedButton.name; // The name of the button

        if (buttonName === 'accept') {
            console.log("accepted");

        }
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
        return { __html: content };  // Prepare the HTML content for rendering
    };


    return (
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
                        {!newTag && <span>Tag(s): </span>}
                        {tagsList.map((tag, index) => (
                            <Badge pill bg="dark" key={index} className="me-2">
                                {tag}
                            </Badge>
                        ))}
                        {newTag && <span>
                            <br />
                            {tagExistsErrorMsg &&
                                <span>
                                    <span style={{ color: "red", fontSize: "11px" }}>
                                        <b>Tag Already Exists !</b> </span><br />
                                    {!tagAddSuccess && <span style={{ color: "blue", fontSize: "10px" }}>
                                        <b>Add tag to article ?</b></span>}
                                </span>}

                            {tagCreateIsSuccess && <span>
                                <span style={{ color: "green", fontSize: "11px" }}>
                                    <b>Tag Created !</b> </span><br />
                                {!tagAddSuccess && <span style={{ color: "blue", fontSize: "10px" }}>
                                    <b>Add tag to article ?</b></span>}
                            </span>}

                            {tagAddIsSuccess && <span style={{ color: "green", fontSize: "11px" }}>
                                <b>Tag Added to article successfully !</b>
                            </span>}

                            {!tagAddSuccess && <><Tooltip title="Accept">
                                <Button size='small'
                                    shape="circle"
                                    name='tagOK'
                                    onClick={(tagExistsErrorMsg || tagCreateIsSuccess) ? tagAddtoArticle : tagCreate}
                                    icon={<CheckCircleTwoToneIcon style={{ color: "green" }}
                                        fontSize="small" />} />
                            </Tooltip> &nbsp;
                            <Tooltip title="Decline">
                                <Button size='small'
                                    shape="circle"
                                    name='tagCancel'
                                    icon={<CancelTwoToneIcon style={{ color: "red", fontSize: '20px' }} />} />
                            </Tooltip>
                            </> }

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
                            onClick={handleShow}
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


                <Modal aria-labelledby="contained-modal-title-vcenter" centered
                    show={show} onHide={handleClose}
                >

                    {/* <Modal.Header closeButton> */}
                    <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
                        <Modal.Title>
                            <span> Confirm Article ? </span>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                        <span>
                            Once confirmed, you will be redirected to the "Review History" Page. <br />
                        </span>
                    </Modal.Body>

                    <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>

                        <Button style={{ borderRadius: "20px" }} variant="outline-danger"
                            onClick={handleClose}>
                            <i className="fa-solid fa-xmark"></i>
                        </Button>

                    </Modal.Footer>
                </Modal>

            </form>




        </div>
    );
}

export default EditorArticleDetailsForRev;