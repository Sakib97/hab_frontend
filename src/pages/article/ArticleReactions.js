import { useEffect, useState } from 'react';
import styles from '../../css/Article.module.css'
import { Button, Popover } from 'antd';
import useAuth from '../../hooks/useAuth';
import useProfileContext from '../../hooks/useProfileContext';
import toast from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { postData } from '../../utils/postDataUtils';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { fetchData } from '../../utils/getDataUtil';
import axios from '../../api/axios';


const ArticleReactions = ({ article_id }) => {
    const { auth } = useAuth();
    const { profile } = useProfileContext();

    const location = useLocation();
    useEffect(() => {
        // Dismiss all toasts when the component is unmounted
        return () => {
            toast.remove();
        };
    }, [location]); // Runs on page navigation

    const ARTICLE_REACTION_API = `/api/v1/comment/react/article`
    const GET_ARTICLE_REACTION_COUNT_URL = `/api/v1/comment/reactions/article/${article_id}`

    const [isReacted, setIsReacted] = useState({
        like: false,
        love: false,
        sad: false,
        angry: false,
        dislike: false
    });

    const axiosPrivate = useAxiosPrivate();
    const queryClient = useQueryClient();

    const axiosInst = axios;
    const {
        data: articleReactionCountData,
        error: articleReactionCountError,
        isLoading: articleReactionCountLoading,
        refetch: articleReactionRefetch
    } = useQuery(
        ['articleReactionCountData', GET_ARTICLE_REACTION_COUNT_URL],
        () => fetchData(GET_ARTICLE_REACTION_COUNT_URL, auth?.email ? axiosPrivate : axiosInst),
        {
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );

    const reactionMutation = useMutation({
        mutationFn: postData,
        onSuccess: (response) => {
            queryClient.invalidateQueries(['article', article_id]);
            queryClient.invalidateQueries('articleReactionCountData');
        },
        onError: (error) => {
            console.error("Error making reaction:", error);
        }

    });



    const toggleReaction = (reaction) => {
        // toggle only if the user is authenticated
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
        // make it as such that other reactions are not affected

        setIsReacted((prev) => ({
            // make the rest false
            // ...prev,
            like: false,
            love: false,
            sad: false,
            angry: false,
            dislike: false,
            [reaction]: !prev[reaction]
        }));
        const data = {
            "content_id": article_id,
            "reaction_type": reaction,
        };
        reactionMutation.mutate({ data: data, url: ARTICLE_REACTION_API, axiosInstance: axiosPrivate });
        // articleReactionRefetch();
        
    }


    return (
        <div className={`${styles.articleReactions}`}>
            <Toaster />
            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover className={`${styles.articleReactionsName}`} content={<div >Like</div>}>
                        <i disabled className={`fa-${isReacted.like || articleReactionCountData?.user_reaction === "like" ?
                            'solid' : 'regular'} fa-thumbs-up`}
                            style={{
                                color: '#0565ad', cursor: 'pointer',
                                transform: isReacted.like || articleReactionCountData?.user_reaction==="like" ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('like')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>
                    {articleReactionCountData?.reactions?.like ?
                        articleReactionCountData?.reactions?.like : 0}
                </div>
            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Love</div>}>
                        <i className={`fa-${isReacted.love || articleReactionCountData?.user_reaction==="love" ? 'solid' : 'regular'} fa-heart`}
                            style={{
                                color: '#ff009e', cursor: 'pointer',
                                transform: isReacted.love || articleReactionCountData?.user_reaction==="love" ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('love')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>{articleReactionCountData?.reactions?.love ?
                    articleReactionCountData?.reactions?.love : 0}</div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Sad</div>}>
                        <i className={`fa-${isReacted.sad || articleReactionCountData?.user_reaction==="sad" ? 'solid' : 'regular'} fa-face-sad-tear`}
                            style={{
                                color: '#2a3b90', cursor: 'pointer',
                                transform: isReacted.sad || articleReactionCountData?.user_reaction==="sad" ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('sad')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>
                    {articleReactionCountData?.reactions?.sad ?
                        articleReactionCountData?.reactions?.sad : 0}
                </div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Angry</div>}>
                        <i className={`fa-${isReacted.angry || articleReactionCountData?.user_reaction==="angry" ? 'solid' : 'regular'} fa-face-angry`}
                            style={{
                                color: '#ff0000', cursor: 'pointer',
                                transform: isReacted.angry || articleReactionCountData?.user_reaction==="angry" ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('angry')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>
                    {articleReactionCountData?.reactions?.angry ?
                        articleReactionCountData?.reactions?.angry : 0}
                </div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Dislike</div>}>
                        <i className={`fa-${isReacted.dislike || articleReactionCountData?.user_reaction==="dislike" ? 'solid' : 'regular'} fa-thumbs-down`}
                            style={{
                                color: '#8b0808', cursor: 'pointer',
                                transform: isReacted.dislike || articleReactionCountData?.user_reaction==="dislike" ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('dislike')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>
                    {articleReactionCountData?.reactions?.dislike ?
                        articleReactionCountData?.reactions?.dislike : 0}
                </div>

            </div>




        </div>
    );
}

export default ArticleReactions;