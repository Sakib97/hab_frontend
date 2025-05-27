import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { fetchData } from "../../utils/getDataUtil";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import styles from '../../css/ProfileMyArticle.module.css'
import { getFormattedTime } from "../../utils/dateUtils";
import { slugify, deSlugify } from "../../utils/slugAndStringUtil";
import { postData } from "../../utils/postDataUtils";
import { useEffect, useState } from "react";
import { renderStrArray } from "../../utils/htmlRenderUtil";

const ProfileMyArticleDetails = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const articleID = searchParams.get('a_id');
    const isNotification = searchParams.get('notification') === 'true';
    const notificationId = searchParams.get('id');
    const userType = searchParams.get('type');

    const GET_ARTICLE_API = `/api/v1/article/any_article/${articleID}`
    const MARK_NOTIFICATION_CLICKED_API = `/api/v1/notification/mark_notis_as_clicked/${userType}/${notificationId}`

    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    // console.log("isNotification:: ",isNotification);
    // console.log("notificationID:: ",notificationId);
    // console.log("userType:: ",userType);



    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This simulates clicking the browser's back button
    };

    // get this article by article ID
    const { data: articleData, error: articleError,
        isLoading: articleLoading } = useQuery(
            ['authorArticleHistoryData', GET_ARTICLE_API],
            () => fetchData(GET_ARTICLE_API, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );


    // This is for marking the notification as clicked when entered this page 
    // via the notification link ----------------------------------------------
    const [notisUrlError, setNotisUrlError] = useState(false)
    const queryClient = useQueryClient();
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
            queryClient.invalidateQueries('generalNotisData');
        },
    });


    useEffect(() => {
        if (isNotification && notificationId && userType) {
            // console.log("Notification clicked", isNotification);
            // console.log("id: ", notificationId);
            // console.log("userType: ", userType);
            notisMutation.mutate({
                data: {},
                url: MARK_NOTIFICATION_CLICKED_API,
                axiosInstance: axiosInst
            });
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

    if (articleError) {
        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    if (notisMutation.isError || notisUrlError) {
        return <h3 style={{ padding: "30px", color: "red", display: 'flex', justifyContent: 'center' }}>
            <b>Invalid URL ! Please try again !</b></h3>;
    }


    const articleURL = `/${slugify(articleData.category_name)}/${slugify(articleData.subcategory_name)}/article/${articleID}/${slugify(articleData.title_en)}`


    return (
        <div>

            <div style={{
                display: 'flex', justifyContent: 'center',
                marginBottom: '10px'
            }}>
                <button className={`${styles.backButton}`}
                    onClick={handleGoBack}>
                    <i className="fa-solid fa-left-long"></i>
                </button>
            </div>

            {articleData.article_status === "approved" ?
                <div className={`${styles.title}`}>
                    <Link to={articleURL}> {articleData.title_en} </Link>
                </div> :
                <div className={`${styles.title}`}>
                    {articleData.title_en}
                </div>
            }

            <div className={`${styles.subtitle}`}>
                {articleData.subtitle_en}
            </div>

            <div className={`${styles.category}`}>

                <span style={{ border: '2px solid', padding: '6px', borderRadius: '8px' }}>
                    {articleData.category_name} {">"} {articleData.subcategory_name} </span>
            </div>
            <hr />

            <div className={`${styles.middleSection}`}>
                <div className={`${styles.status}`}>
                    <div style={{
                        border: '2px solid', padding: '8px',
                        borderRadius: '8px', marginBottom: '10px'
                    }}>
                        Status: {articleData.article_status === "approved" &&
                            <b style={{ color: 'green', fontSize: '25px' }}>
                                Approved <i className="fa-solid fa-circle-check"></i> </b>}

                        {articleData.article_status === "rejected" &&
                            <b style={{ color: 'red', fontSize: '25px' }}>
                                Rejected <i className="fa-solid fa-circle-xmark"></i> </b>}

                        {articleData.article_status.split('_').slice(0, 2).join('_') === "under_review" &&
                            <b style={{ color: '#103B7F', fontSize: '25px' }}>
                                {/* if it's under_review_edit_1 etc, then seperate the last number */}

                                Under Review {articleData.article_status !== "under_review_new" &&
                                    `(Round ${parseInt(articleData.article_status.match(/\d+$/)[0], 10)})`}
                                &nbsp;  <i className="fa-solid fa-circle-exclamation"></i> </b>}

                        {articleData.article_status.split('_').slice(0, -1).join('_') === "sent_for_edit" &&
                            <b style={{ color: '#B71C1C', fontSize: '25px' }}>
                                Edit Requested (Round {articleData.article_status.split('_')[articleData.article_status.split('_').length - 1]})
                                &nbsp;<i className="fa-solid fa-square-pen"></i> </b>
                        }

                    </div>

                    <div>
                        Editor: <b> {articleData.editor_firstname} {articleData.editor_lastname} </b>

                        ({articleData.editor_email})
                    </div>
                </div>

                <div className={`${styles.time}`}>
                    {articleData.submitted_at !== "None" &&
                        <div>Submitted at: <b> {getFormattedTime(articleData.submitted_at)} </b> </div>}

                    {articleData.sent_for_edit_at !== "None" &&
                        <div>
                            {/* strTimeArray format: "['2025-04-28 23:36:39.697680', '2025-04-28 23:40:37.113449']" */}
                            <br />
                            {renderStrArray(articleData.sent_for_edit_at, "Editor Sent for edit at - ", "time")}
                        </div>}

                    {articleData.resubmitted_at !== "None" &&
                        <div>
                            <br />
                            {renderStrArray(articleData.resubmitted_at, "You Resubmitted at - ", "time")}
                        </div>}


                    {articleData.rejected_at !== "None" &&
                        <div>Rejected at: <b> {getFormattedTime(articleData.rejected_at)} </b> </div>}

                    {articleData.published_at !== "None" &&
                        <div>Published at: <b> {getFormattedTime(articleData.published_at)} </b> </div>}

                </div>
            </div>

            <hr />

            {articleData.decision_comment &&
                <div className={`${styles.decisionComment}`}>
                    <h3> <b>Decision comment:</b>  </h3>
                    {/* strCommentArray format: "['comment1', 'comment2']" */}
                    {renderStrArray(articleData.decision_comment, "", "text")}

                </div>
            }
            {articleData.decision_comment && <hr />}

            {/* {articleData.sent_for_edit_at !== "None" && */}
            {/* if article is under review, don't show the edit button */}
            {articleData.article_status.split('_').slice(0, 2).join('_') !== "under_review" &&
                articleData.article_status !== "rejected" &&
                articleData.article_status !== "approved" &&
                <div className={`${styles.discussion}`}>
                    <Link to={`/profile/write?edit=true&a_id=${articleData.article_id}`}
                        state={{
                            editFromState: true,
                            articleIDFromState: articleData.article_id,
                            decisionCommentFromState: articleData.decision_comment,
                            editorEmail: articleData.editor_email,
                            refreshKey: Date.now() // Add a timestamp to force refresh
                        }}
                    >
                        <button style={{ fontSize: "30px", marginBottom: "10px" }}
                            className={`${styles.discussButton}`}>
                            Go for Editing
                        </button>
                    </Link>

                    <span style={{ fontSize: "22px", color: "#A78021", fontWeight: "bold" }}>
                        Warning: If you go to Edit page, your previously saved draft article (if any) will all be lost !!</span>

                </div>}

            {articleData.article_status.split('_').slice(0, 2).join('_') !== "under_review" &&
                articleData.article_status !== "rejected" &&
                articleData.article_status !== "approved" &&
                <hr />}


            <div className={`${styles.discussion}`}>
                Want to discuss with Editor ? <br />
                <button style={{ marginTop: '20px' }} className={`${styles.discussButton}`}>
                    Write a note
                </button>
            </div>


        </div>
    );
}

export default ProfileMyArticleDetails;