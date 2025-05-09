import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import styles from '../../../css/EditorArticleDetailsForRev.module.css'
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Row, Col } from 'antd';
import { useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import Divider from '@mui/material/Divider';
import { Button, Tooltip } from "antd";
import LanguageToggle from '../../../components/LanguageToggle';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import EditorArticleDetailsActions from './EditorArticleDetailsActions';
import { getFormattedTime } from '../../../utils/dateUtils';
import { fetchData } from '../../../utils/getDataUtil';
import { postData } from '../../../utils/postDataUtils';
import { SafeHtmlRenderer, renderStrArray } from '../../../utils/htmlRenderUtil';
import { set } from 'jodit/esm/core/helpers';

const EditorArticleDetailsForRev = () => {
    const { articleID } = useParams();

    // if ?notification=true&id=... is present in the URL, then mark the notification as CLICKED
    const [searchParams] = useSearchParams();
    const isNotification = searchParams.get('notification') === 'true';
    const notificationId = searchParams.get('id');
    const userType = searchParams.get('type');

    const CREATE_TAG_API = '/api/v1/category/create_tag'
    const ADD_TAG_TO_ARTICLE_API = '/api/v1/article/add_tag_to_article'
    const GET_UNREV_ARTICLE_BY_ID_API = `/api/v1/article/unreviewed_article/${articleID}`
    const MARK_NOTIFICATION_CLICKED_API = `/api/v1/notification/mark_notis_as_clicked/${userType}/${notificationId}`

    const [newTag, setNewTag] = useState(false)
    const [tagsList, setTagsList] = useState([])
    const [submittedAt, setSubmittedAt] = useState()

    const [tagExistsErrorMsg, setTagErrorMsg] = useState('')
    const [tagAddSuccess, setTagAddSuccess] = useState(false)

    const [notisUrlError, setNotisUrlError] = useState(false)

    const axiosPrivate = useAxiosPrivate();
    // when testing erroneous endpoints, react-query will do 3 retries 
    // with exponential backoff. That means your tests take longer and 
    // might even time-out for those cases. 
    // This can be solved by turning off retries for tests globally, via the QueryClient. 
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


    // get this article by article ID
    const { data: articleData, error: articleError,
        isLoading: articleLoading } = useQuery(
            ['articleData', GET_UNREV_ARTICLE_BY_ID_API],
            () => fetchData(GET_UNREV_ARTICLE_BY_ID_API, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );


    const article = articleData?.article;
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
        const finalFormattedString = getFormattedTime(dateStr);
        setSubmittedAt(finalFormattedString)

    }, [article]);

    // This is for marking the notification as clicked when entered this page 
    // via the notification link ----------------------------------------------
    const notisMutation = useMutation({
        mutationFn: postData,
        onSuccess: (response) => {
            // console.log("Notification marked as clicked:", response.data.type); // new_article_review_request_article_id_86

            // Extract the article ID from the response 
            // response.data.type = new_article_review_request_article_id_86
            const atricle_id_from_response = parseInt(response.data.type.split('_').pop(), 10); // 86
            if (atricle_id_from_response &&
                atricle_id_from_response !== parseInt(articleID, 10)) {
                setNotisUrlError(true)
                return;
            } else {
                setNotisUrlError(false)
            }
            // Invalidate and refetch
            queryClient.invalidateQueries('editorNotisData');
        },
    });


    useEffect(() => {
        if (isNotification && notificationId && userType) {
            // console.log("Notification clicked", isNotification);
            // console.log("id: ", notificationId);
            // console.log("userType: ", userType);
            notisMutation.mutate({ data: {}, url: MARK_NOTIFICATION_CLICKED_API, axiosInstance: axiosInst });
        }
        else {
            // setNotisUrlError(true)
            return;
        }
    }, [isNotification, notificationId, userType]);
    // ---------------------------------------------------


    if (articleLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }
    if (!article || articleError) {
        if (articleError.response.data.detail === "Article Already Reviewed !") {
            return <h3 style={{
                display: 'flex', justifyContent: 'center',
                padding: "30px", color: "red"
            }}>Article Already Reviewed !</h3>;
        }
        else if (articleError.response.data.detail === "Article sent for edit !") {
            return <h3 style={{
                display: 'flex', justifyContent: 'center',
                padding: "30px", color: "red"
            }}>Article Sent for Edit !</h3>;
        }
        else {
            return <h3 style={{
                display: 'flex', justifyContent: 'center',
                padding: "30px", color: "red"
            }}>No article data found!</h3>;
        }
    }

    if (notisMutation.isError || notisUrlError) {
        return <h3 style={{ padding: "30px", color: "red", display: 'flex', justifyContent: 'center' }}>
            <b>Invalid URL ! Please try again !!</b></h3>;
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

    const renderHTMLContent = (content) => {
        return { __html: content };  // Prepare the HTML content for rendering
    };


    return (
        <div className={`${styles.outerContainer}`}>
            <div className={styles.articleContainer}>

                <h2 className={styles.title}> {article.title_en}</h2>
                <h2 style={{ marginBottom: '20px' }} className={`${styles.title} bn`}>{article.title_bn}</h2>

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
                            </>}

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

                {article.resubmitted_at !== "None" && <div>
                    <br />
                    Resubmitted at:
                    {renderStrArray(article.resubmitted_at, "", "time")}
                </div>}

                <hr className={styles.divider} />
                Article Status: &nbsp;
                {article.status.split('_').slice(0, 2).join('_') === "under_review" &&
                    <b style={{ color: '#103B7F', fontSize: '16px' }}>
                        {/* if it's under_review_edit_1 etc, then seperate the last number */}
                        Under Review {article.status !== "under_review_new" &&
                            `(Round ${parseInt(article.status.match(/\d+$/)[0], 10)})`}
                        &nbsp; <i className="fa-solid fa-circle-exclamation"></i> </b>}
            </div>
            <hr />

            <div className={styles.articleContainer}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: "10px" }}>
                    <LanguageToggle onToggle={handleLanguageToggle} />
                </div>
                <div>
                    <img src={article.cover_img_link} alt="cover_image" />
                </div>
                <div style={{
                    display: "flex", justifyContent: "center",
                    color: "#6c757d", marginBottom: '10px'
                }} >

                    {isEnglish && <span>Caption: {article.cover_img_cap_en}</span>}
                    {!isEnglish && <span className='bn3'>শিরোনাম : {article.cover_img_cap_bn}</span>}

                </div>
                <div>
                    {isEnglish && <span><b>{article.subtitle_en}</b></span>}
                    {!isEnglish && <strong><span className='bn3'>{article.subtitle_bn}</span></strong>}

                </div>
                <hr className={styles.divider} />
                <div style={{ textAlign: "justify", fontSize: "18px" }}>
                    {isEnglish && <div
                        dangerouslySetInnerHTML={renderHTMLContent(article.content_en)}  // Render the HTML content
                    />}

                    {!isEnglish &&
                        <div>
                            <SafeHtmlRenderer html={article.content_bn} />
                        </div>
                    }
                </div>
            </div>
            <hr />

            <EditorArticleDetailsActions article_id={article.article_id} />
        </div>
    );
}

export default EditorArticleDetailsForRev;