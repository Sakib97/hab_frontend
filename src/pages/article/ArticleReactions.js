import { useState } from 'react';
import styles from '../../css/Article.module.css'
import { Button, Popover } from 'antd';

const ArticleReacftions = () => {
    const [isReacted, setIsReacted] = useState({
        like: false,
        love: false,
        sad: false,
        angry: false,
        dislike: false
    });
    const toggleReaction = (reaction) => {
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
    }

    return (
        <div className={`${styles.articleReactions}`}>
            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Like</div>}>
                        <i className={`fa-${isReacted.like ? 'solid' : 'regular'} fa-thumbs-up`}
                            style={{
                                color: '#0565ad', cursor: 'pointer',
                                transform: isReacted.like ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('like')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>11</div>
            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Love</div>}>
                        <i className={`fa-${isReacted.love ? 'solid' : 'regular'} fa-heart`}
                            style={{
                                color: '#ff009e', cursor: 'pointer',
                                transform: isReacted.love ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('love')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>21</div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Sad</div>}>
                        <i className={`fa-${isReacted.sad ? 'solid' : 'regular'} fa-face-sad-tear`}
                            style={{
                                color: '#2a3b90', cursor: 'pointer',
                                transform: isReacted.sad ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('sad')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>15</div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Angry</div>}>
                        <i className={`fa-${isReacted.angry ? 'solid' : 'regular'} fa-face-angry`}
                            style={{
                                color: '#ff0000', cursor: 'pointer',
                                transform: isReacted.angry ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('angry')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>18</div>

            </div>

            <div>
                <div className={`${styles.articleReactionsIcons}`}>
                    <Popover content={<div>Dislike</div>}>
                        <i className={`fa-${isReacted.dislike ? 'solid' : 'regular'} fa-thumbs-down`}
                            style={{
                                color: '#8b0808', cursor: 'pointer',
                                transform: isReacted.dislike ? 'scale(1.2)' : 'scale(1)'
                            }}
                            onClick={() => toggleReaction('dislike')}></i>
                    </Popover>
                </div>
                <div className={`${styles.articleReactionsCount}`}>04</div>

            </div>


        </div>
    );
}

export default ArticleReacftions;