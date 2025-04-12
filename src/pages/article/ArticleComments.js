import { useState } from 'react';
import styles from '../../css/Article.module.css'
import { SendOutlined } from '@ant-design/icons';


const ArticleComments = () => {
    // const [isReacted, setIsReacted] = useState({
    //     like: false,
    //     dislike: false
    // });
    // const toggleReaction = (reaction) => {
    //     setIsReacted((prev) => ({
    //         // make the rest false
    //         // ...prev,
    //         like: false,
    //         dislike: false,
    //         [reaction]: !prev[reaction]
    //     }));
    // }

    // The keys are the comment IDs, The values are objects like { like: false, dislike: false } 
    const [isReacted, setIsReacted] = useState({});
    const toggleReaction = (commentId, reaction) => {
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

    return (
        <div className={`${styles.articleComments}`}>
            <div className={`${styles.totalComments}`}>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>
                    20 Comments </div>
                <div style={{ fontWeight: 'bold', fontSize: '20px' }}>  John Doe </div>
            </div>
            <hr style={{ border: "1px solid black" }} />

            <div className={`${styles.commentBox}`}>
                <form className={styles.commentForm}>
                    <textarea
                        className={styles.commentFormInput}
                        type="text"
                        placeholder="Write your comment..."
                        autoComplete="comment"
                        required />

                    <button type="submit"
                        className={`${styles.commentSubmitButton}`}
                    // disabled
                    >
                        Post <SendOutlined />
                    </button>
                </form>
            </div>

            <div>
                <select className={`${styles.commentSortDropdown}`}>
                    <option value="new">New Comments First</option>
                    <option value="old">Old Comments First</option>
                </select>
            </div>

            {comments.map((item, index) => {
                // For the current comment, we extract its reaction state from isReacted.
                // If it doesn't exist yet, we fallback to default: { like: false, dislike: false }
                const reaction = isReacted[index] || { like: false, dislike: false };
                return (
                    <div key={index} className={`${styles.comments}`}>
                        <div className={`${styles.commentHead}`}>
                            <div className={`${styles.commenterPic}`}>
                                <img className={`${styles.commenterPic}`} src="https://picsum.photos/400/180" alt="" />
                            </div>
                            <div className={`${styles.commenterInfo}`}>
                                <div className={`${styles.commenterName}`}>  John Doe, </div>
                                <div className={`${styles.commentDate}`}>  10 February 2025 </div>
                            </div>
                        </div>

                        <div className={`${styles.commentBody}`}>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime ex natus odit, deleniti minus nisi qui est cumque, quae voluptatibus consectetur quos, nulla harum voluptate eveniet veritatis iure! Ullam, reiciendis.
                        </div>

                        <div className={`${styles.commentReactions}`}>
                            <i className={`fa-${reaction.like ? 'solid' : 'regular'} fa-thumbs-up`}
                                style={{
                                    color: '#0565ad', cursor: 'pointer',
                                    transform: reaction.like ? 'scale(1.2)' : 'scale(1)'
                                }}
                                onClick={() => toggleReaction(index, 'like')}></i>
                            <span style={{}}> 11 </span>


                            <i className={`fa-${reaction.dislike ? 'solid' : 'regular'} fa-thumbs-down`}
                                style={{
                                    color: '#8b0808', cursor: 'pointer', marginLeft: '10px',
                                    transform: reaction.dislike ? 'scale(1.2)' : 'scale(1)'
                                }}
                                onClick={() => toggleReaction(index, 'dislike')}></i>
                            <span style={{}}> 05 </span>

                            {/* Reply Related Buttons start */}
                            <button onClick={() => toggleExpandReplies(index)} className={`${styles.commentReplyBtn}`}>
                                {repliesCount(index)} Replies </button>

                            <button onClick={() => toggleReplyBox(index)}
                                className={`${styles.commentReplyBtn}`}>Reply</button>
                            {/* Reply Related Buttons end */}
                            
                            <span style={{ marginLeft: '20px', color: '#c41b08' }}> Report </span>

                            {/* comment reply box start*/}
                            {showReplyBox[index] &&
                                <div className={`${styles.commentReplyBox}`}>
                                    <form className={styles.commentReplyForm}>
                                        <textarea
                                            className={styles.commentReplyFormInput}
                                            type="text"
                                            placeholder="Write your reply..."
                                            autoComplete="reply"
                                            required />

                                        <button type="submit"
                                            className={`${styles.commentReplySubmitButton}`}
                                        // disabled
                                        >
                                            Reply <SendOutlined />
                                        </button>
                                    </form>
                                </div>}
                            {/* comment reply box end*/}


                            {/* comment replies expand start*/}
                            {expandReplies[index] && repliesCount(index) > 0 &&
                                <div className={`${styles.commentReplies}`}>
                                    {replies[index].map((reply, replyIndex) => {
                                        return (
                                            <div key={replyIndex} className={`${styles.commentReply}`}>

                                                <div className={`${styles.commentHead}`}>
                                                    <div className={`${styles.commenterPic}`}>
                                                        <img className={`${styles.commenterPic}`} src="https://picsum.photos/400/180" alt="" />
                                                    </div>
                                                    <div className={`${styles.commenterInfo}`}>
                                                        <div className={`${styles.commenterName}`}>  John Doe, </div>
                                                        <div className={`${styles.commentDate}`}>  10 February 2025 </div>
                                                    </div>
                                                </div>

                                                <div className={`${styles.commentBody}`}>
                                                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            }
                            {/* comment replies expand end*/}


                        </div>
                        <hr />
                    </div>

                )
            })}

        </div>
    );
}

export default ArticleComments;