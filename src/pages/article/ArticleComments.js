import { useEffect, useState } from 'react';
import styles from '../../css/Article.module.css'
import { SendOutlined } from '@ant-design/icons';
import useAuth from '../../hooks/useAuth';
import BootstrapButton from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import useProfileContext from '../../hooks/useProfileContext';
import { fetchData } from '../../utils/getDataUtil';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { postData } from '../../utils/postDataUtils';
import { useMutation, useQuery } from 'react-query';
import axios from '../../api/axios';
import { getFormattedTime } from '../../utils/dateUtils';
import { List } from 'antd';
import { useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import { commentValidationSchema } from '../../schemas/commentValidationSchema';

const ArticleComments = ({ article_id, article_comment_count }) => {
    console.log("ArticleComments component rendered with article_id:", article_id, article_comment_count);

    const { auth } = useAuth();
    const { profile } = useProfileContext();

    const location = useLocation();
    useEffect(() => {
        // Dismiss all toasts when the component is unmounted
        return () => {
            toast.remove();
        };
    }, [location]); // Runs on page navigation

    const [displayArticleComments, setDiaplayArticleComments] = useState([]);
    const [page, setPage] = useState(1);
    const pageSize = 2;
    const GET_ARTICLE_COMMENT_API = `/api/v1/comment/article/comments/${article_id}?page=${page}&limit=${pageSize}`;
    const POST_ARTICLE_COMMENT_API = `/api/v1/comment/article/post_comment/${article_id}`;

    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axios;

    const {
        data: articleCommentsData,
        error: articleCommentsError,
        isLoading: articleCommentsLoading,
        isFetching: articleCommentsFetching
    } = useQuery(
        ['articleCommentsData', GET_ARTICLE_COMMENT_API, page],
        () => fetchData(GET_ARTICLE_COMMENT_API, auth?.email ? axiosPrivate : axiosInst),
        {
            keepPreviousData: true, // Preserve previous data while fetching new
            refetchOnWindowFocus: false,  // Disable refetch on window focus
            // onSuccess: (data) => {
            //     setTotalCount(data.totalCount);
            //     setPage(1); // Reset page to 1 on success
            // }
        }
    );

    useEffect(() => {
        const processedComments = articleCommentsData?.parent_comments?.map(comment => {
            return {
                comment_text: comment.comment_text,
                comment_id: comment.comment_id,
                user_slug: comment.user_slug,
                username: comment.user_name,
                user_image_url: comment.user_image_url,
                created_at: getFormattedTime(comment.created_at),
            };
        });
        setDiaplayArticleComments(processedComments);
    }, [articleCommentsData]);


    // The keys are the comment IDs, The values are objects like { like: false, dislike: false } 
    const [isReacted, setIsReacted] = useState({});
    const toggleReaction = (commentId, reaction) => {
        if (!auth?.email) {
            // toast.error("Please Login First !", { duration: 3000 });
            toast("Please Login First !", {
                duration: 3000,
                // icon: <i style={{color: 'red', fontSize: '22px'}} 
                // className="fa-solid fa-triangle-exclamation"></i>,
                icon: <i style={{ color: 'red', fontSize: '25px' }}
                    className="fi fi-ss-octagon-exclamation"></i>
            });
            return;
        }

        setIsReacted((prev) => {
            // We grab the current reaction state of the given comment.
            // If there’s no state yet for that comment, we default to { like: false, dislike: false }.
            const current = prev[commentId] || { like: false, dislike: false };
            const newReaction = {
                like: false,
                dislike: false,
                [reaction]: !current[reaction]
            };

            // We return a new object that keeps the previous state intact (...prev) 
            // and updates the specific comment’s state.
            return {
                ...prev,
                [commentId]: newReaction
            };
        });
    };

    ///// Mutation for posting a new comment/////////////
    const queryClient = useQueryClient();
    const postCommentMutation = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            // console.log("Comment posted successfully!");
            queryClient.invalidateQueries('articleCommentsData');
            setPage(1); // Reset to the first page after posting a comment
            toast.success("Comment posted successfully!", {
                duration: 3000,
                icon: <i style={{ color: 'green', fontSize: '25px' }}
                    className="fi fi-ss-check"></i>
            });
        },
        onError: (error) => {
            console.error("Error posting comment:", error);
            toast.error("Failed to post comment. Please try again.", {
                duration: 3000,
                icon: <i style={{ color: 'red', fontSize: '25px' }}
                    className="fi fi-ss-octagon-exclamation"></i>
            });
        }
    });

    // ////////////For formik validation and submission of comments//////////
    const onParentCommentSubmit = (values, actions) => {
        const data = {
            "comment_text": values.comment_text.trim(),
            "parent_comment_id": "",
        }
        postCommentMutation.mutate({ data: data, url: POST_ARTICLE_COMMENT_API, axiosInstance: axiosPrivate });
        actions.resetForm(); // Reset the form after submission
    }
    const { values,
        errors,
        touched,
        isSubmitting,
        handleBlur,
        handleChange,
        handleSubmit,
    } = useFormik({
        initialValues: {
            comment_text: '',
        },
        validationSchema: commentValidationSchema,
        onSubmit: (onParentCommentSubmit)
    });





    const [showReplyBox, setShowReplyBox] = useState({});
    const toggleReplyBox = (commentID) => {
        setShowReplyBox((prev) => {
            // We grab the current visibility state of the given comment's reply box.
            // If there’s no state yet for that comment, we default to false.
            const current = prev[commentID] || false;

            // We return a new object that keeps the previous state intact (...prev) 
            // and updates the specific comment’s reply box visibility.
            return {
                ...prev,
                [commentID]: !current
            };
        });
    }

    // const [expandReplies, setExpandReplies] = useState(false);
    const [expandReplies, setExpandReplies] = useState({});
    const toggleExpandReplies = (commentID) => {
        setExpandReplies((prev) => {
            const current = prev[commentID] || false;
            return {
                ...prev,
                [commentID]: !current
            };
        });
    }


    // demo comments
    const comments = [1, 2, 3, 4, 5];
    // demo replies
    const replies = { 0: [1, 2, 9, 10], 1: [3, 4], 2: [5], 4: [1, 2, 3] }; // demo replies for each comment
    const repliesCount = (commentID) => {
        if (replies.hasOwnProperty(commentID)) {
            return replies[commentID].length;
        } else {
            return 0;
        }
    }


    if (articleCommentsLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }

    if (articleCommentsError) {
        return <h3 style={{
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }

    return (
        <div className={`${styles.articleComments}`}>
            <Toaster />
            {/* {auth?.email ? <> */}
            <div className={`${styles.totalComments}`}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    {/* {article_comment_count || 0}: This ensures that if 
                    article_comment_count is null or undefined, it will display 0 instead of nothing. */}
                    {article_comment_count || 0} {article_comment_count === 1 ? 'Comment' : 'Comments'} </div>

                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    {auth?.email ? <>
                        {profile?.first_name} {profile?.last_name}
                    </> :
                        <>
                            <BootstrapButton
                                as={Link} // Makes Button render as a Link
                                to="/auth/login"
                                style={{ borderColor: 'black', color: 'black' }}
                                variant="outline-light">
                                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>
                                    Log in
                                </span>
                            </BootstrapButton>

                        </>
                    }
                </div>
            </div>
            <hr style={{ border: "1px solid black" }} />

            {auth?.email ? <>
                <div style={{textAlign: 'center', fontSize: '15px', fontWeight: 'bold', color: 'red' }}>
                    {errors.comment_text && touched.comment_text && (
                        <div className={styles.errorMessage}>{errors.comment_text}</div>
                    )}
                </div>

                <div className={`${styles.commentBox}`}>
                    <form onSubmit={handleSubmit} autoComplete="off"
                        className={styles.commentForm}
                    >
                        <textarea
                            className={styles.commentFormInput}
                            name="comment_text"
                            id='comment_text'
                            value={values.comment_text}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="text"
                            placeholder="Write your comment..."
                            autoComplete="comment"
                            required />
                        <br />

                        <button type="submit"
                            className={`${styles.commentSubmitButton}`}
                        // disabled
                        >
                            Post <SendOutlined />
                        </button>
                    </form>
                </div>
            </> : <>
                <div style={{
                    textAlign: 'center', fontSize: '20px', fontWeight: 'bold',
                    color: '#c41b08'
                }}>
                    Please Log in to post your own comments !
                </div>
            </>}

            <div>
                <select className={`${styles.commentSortDropdown}`}>
                    <option value="new">New Comments First</option>
                    <option value="old">Old Comments First</option>
                </select>
            </div>

            {displayArticleComments && displayArticleComments.length > 0 ? (
                displayArticleComments.map((comment, idx) => {
                    const commentId = comment.comment_id;
                    const reaction = isReacted[commentId] || { like: false, dislike: false };
                    return (
                        <div key={commentId} className={styles.comments}>
                            <div className={styles.commentHead}>
                                <div className={styles.commenterPic}>
                                    <img
                                        className={styles.commenterPic}
                                        src={comment.user_image_url || "https://picsum.photos/400/180"}
                                        alt=""
                                    />
                                </div>
                                <div className={styles.commenterInfo}>
                                    <div className={styles.commenterName}>
                                        {comment.username || "Unknownv User"},
                                    </div>
                                    <div className={styles.commentDate}>
                                        {comment.created_at}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.commentBody}>
                                {comment.comment_text}
                            </div>

                            <div className={styles.commentReactions}>
                                <i
                                    className={`fa-${reaction.like ? 'solid' : 'regular'} fa-thumbs-up`}
                                    style={{
                                        color: '#0565ad',
                                        cursor: 'pointer',
                                        transform: reaction.like ? 'scale(1.2)' : 'scale(1)'
                                    }}
                                    onClick={() => toggleReaction(commentId, 'like')}
                                ></i>
                                <span> 11 </span>

                                <i
                                    className={`fa-${reaction.dislike ? 'solid' : 'regular'} fa-thumbs-down`}
                                    style={{
                                        color: '#8b0808',
                                        cursor: 'pointer',
                                        marginLeft: '10px',
                                        transform: reaction.dislike ? 'scale(1.2)' : 'scale(1)'
                                    }}
                                    onClick={() => toggleReaction(commentId, 'dislike')}
                                ></i>
                                <span> 05 </span>

                                {/* Reply Related Buttons start */}
                                <button
                                    onClick={() => toggleExpandReplies(commentId)}
                                    className={styles.commentReplyBtn}
                                >
                                    {repliesCount(commentId)} Replies
                                </button>

                                {auth?.email && (
                                    <button
                                        onClick={() => toggleReplyBox(commentId)}
                                        className={styles.commentReplyBtn}
                                    >
                                        Reply
                                    </button>
                                )}
                                {/* Reply Related Buttons end */}

                                {auth?.email && (
                                    <span style={{ marginLeft: '20px', color: '#c41b08' }}>
                                        Report
                                    </span>
                                )}

                                {/* comment reply box start */}
                                {showReplyBox[commentId] && (
                                    <div className={styles.commentReplyBox}>
                                        <form className={styles.commentReplyForm}>
                                            <textarea
                                                className={styles.commentReplyFormInput}
                                                type="text"
                                                placeholder="Write your reply..."
                                                autoComplete="reply"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                className={styles.commentReplySubmitButton}
                                            >
                                                Reply <SendOutlined />
                                            </button>
                                        </form>
                                    </div>
                                )}
                                {/* comment reply box end */}

                                {/* comment replies expand start */}
                                {expandReplies[commentId] && repliesCount(commentId) > 0 && (
                                    <div className={styles.commentReplies}>
                                        {(replies[commentId] || []).map((reply, replyIndex) => (
                                            <div key={replyIndex} className={styles.commentReply}>
                                                <div className={styles.commentHead}>
                                                    <div className={styles.commenterPic}>
                                                        <img
                                                            className={styles.commenterPic}
                                                            src="https://picsum.photos/400/180"
                                                            alt=""
                                                        />
                                                    </div>
                                                    <div className={styles.commenterInfo}>
                                                        <div className={styles.commenterName}>
                                                            John Doe,
                                                        </div>
                                                        <div className={styles.commentDate}>
                                                            10 February 2025
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles.commentBody}>
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {/* comment replies expand end */}
                            </div>
                            <hr />
                        </div>
                    );
                })
            ) : (
                <div style={{ textAlign: 'center', padding: '20px' }}>No comments yet.</div>
            )}

            {/* Pagination Controls */}
            {articleCommentsData?.hasMore && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <button
                        onClick={() => setPage(page + 1)}
                        className={styles.commentReplyBtn}
                        disabled={articleCommentsLoading}
                    >
                        {articleCommentsLoading ? 'Loading...' : 'Load More'}
                    </button>
                </div>
            )}
            {/* 
            {/* </>
                : <>
                    <div style={{
                        textAlign: 'center', fontSize: '20px', fontWeight: 'bold',
                        color: '#c41b08'}}>
                        Please Log in post your own comments.
                    </div>

                </>
            } */}



        </div>
    );
}

export default ArticleComments;