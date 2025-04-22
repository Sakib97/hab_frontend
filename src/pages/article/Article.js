import styles from '../../css/Article.module.css'
import { Breadcrumb } from 'antd';
import LanguageToggle from '../../components/LanguageToggle';
import ArticleReacftions from './ArticleReactions';
import ArticleComments from './ArticleComments';
import Footer from '../../components/Footer';
import { useParams } from 'react-router-dom';
import { deSlugify, slugify, stringToArray } from '../../utils/slugAndStringUtil';
import { fetchData } from '../../utils/getDataUtil';
import axios from '../../api/axios';
import { useQuery } from 'react-query';
import { useEffect, useMemo, useState } from 'react';
import { getFormattedTime } from '../../utils/dateUtils';
import GoToTopButton from '../../components/GoToTopButton';
import { FloatButton } from 'antd';
import { position } from 'jodit/esm/core/helpers';
import { SafeHtmlRenderer } from '../../utils/htmlRenderUtil';


const Article = () => {
    const { catSlug, subCatSlug, articleID, articleTitleSlug } = useParams();
    // console.log(catSlug, subCatSlug, articleID, articleTitleSlug);

    const GET_ARTICLE_URL = `/api/v1/article/approved_article/${articleID}`
    const axiosInst = axios;
    const { data: articleData, error: articleError, isLoading: articleLoading } = useQuery(
        ['articleData', GET_ARTICLE_URL],
        () => fetchData(GET_ARTICLE_URL, axiosInst),
        {
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );

    const [article, setArticle] = useState(null);
    const [slugMismatch, setSlugMismatch] = useState(false);
    // Check if the article slug matches the URL slug

    useEffect(() => {
        if (articleData) {
            const articleTitleSlugFromData = slugify(articleData.article.title_en);
            const catSlugFromData = slugify(articleData.article.category_name);
            const subcatSlugFromData = slugify(articleData.article.subcategory_name);

            if (articleTitleSlugFromData !== articleTitleSlug ||
                catSlugFromData !== catSlug ||
                subcatSlugFromData !== subCatSlug) {
                setSlugMismatch(true);
            } else {
                setArticle(articleData);
                setSlugMismatch(false);
            }
        } else {
            setArticle(null);
        }
    }, [articleData]);

    const [isEnglish, setIsEnglish] = useState(true);

    const handleLanguageToggle = (newIsEnglish) => {
        setIsEnglish(newIsEnglish);  // Update the parent's state based on the toggle
        // console.log('Language changed to:', newIsEnglish ? 'English' : 'Bengali');
    };


    return (
        <div className={`${styles.article}`}>

            <div style={{
                justifyContent: "center", backgroundColor: "white",
                display: "flex", padding: "1px", fontSize: "30px"
            }}>
                {articleLoading && <div>Loading...</div>}
                {articleError && <div style={{ color: 'red' }}>
                    <b>Error: Data Loading Error ! Please Try Again !</b></div>}
                {slugMismatch && <div style={{ color: 'red' }}>
                    <b> Error: Invalid URL ! </b> </div>}
            </div>


            {!articleLoading && !articleError && !slugMismatch && article &&
                <div className={`container`}>
                    <GoToTopButton />

                    <div className={styles.articleMenu}>
                        <Breadcrumb
                            style={{ fontSize: '18px', marginBottom: '10px' }}
                            separator=">"
                            items={[
                                {
                                    // title: 'Home',
                                    title: `${articleData.article.category_name}` // Category,
                                },
                                {
                                    // title: 'Application Center',
                                    title: `${articleData.article.subcategory_name}` // Subcategory,
                                }
                            ]}
                        />
                        
                        <LanguageToggle onToggle={handleLanguageToggle} />

                    </div>

                    <div className={`${styles.articleHead}`}>

                        {isEnglish && <h1 >{articleData.article.title_en}</h1>}
                        {!isEnglish && <h1 className='bn'>{articleData.article.title_bn}</h1>}

                        {isEnglish && <h5> {articleData.article.subtitle_en}</h5>}
                        {!isEnglish && <h5 className='bn3'> {articleData.article.subtitle_bn}</h5>}

                        {/* <img src="https://picsum.photos/900/300" alt="Article" className={styles.articleImage} /> */}
                        <img src={articleData.article.cover_img_link} alt="Article"
                            className={styles.articleImage} />

                        <div className={`${styles.articleImageCaption}`}>
                            {isEnglish && articleData.article.cover_img_cap_en}
                            {!isEnglish && <span className='bn3'> { articleData.article.cover_img_cap_bn }</span> }
                        </div>

                        <div className={`${styles.authorAndDateOfArticle}`}>
                            <div className={`${styles.authorPicOfArticle}`}>
                                <img className={`${styles.authorPicOfArticle}`}
                                    src={articleData.article.author_image_url} alt="" />
                            </div>
                            <div className={`${styles.authorNameOfArticle}`}>
                                {articleData.article.author_firstname} {articleData.article.author_lastname}
                                <br />
                                <div style={{ fontSize: '13px', color: 'gray' }}>
                                    {getFormattedTime(articleData.article.published_at)}
                                </div>
                            </div>
                        </div>

                    </div>
                    <hr />

                    <div className={`${styles.articleBody}`}>
                        <div style={{textAlign: "justify", fontSize: "18px"}} className={`${styles.articleBodyText}`}>
                            {isEnglish && <div dangerouslySetInnerHTML={{ __html: articleData.article.content_en }} />}
                            {/* {!isEnglish && <div dangerouslySetInnerHTML={{ __html: articleData.article.content_bn }} />} */}
                            {!isEnglish && <SafeHtmlRenderer html={articleData.article.content_bn} />}
                            {/*  */}
                        </div>

                    </div>

                    <hr />
                    <div className={`${styles.articleTags}`}>
                        <div className={`${styles.articleTagsTitle}`}>Tags:</div>
                        <div className={`${styles.articleTagsList}`}>
                            {stringToArray(articleData.article.tags).map((tag, index) => (
                                <button key={index} type='button' className={styles.articleTagsButton}>
                                    {tag}
                                </button>
                            ))}

                        </div>
                    </div>
                    <hr />
                    <ArticleReacftions />
                    <ArticleComments />
                </div>}

            {!articleLoading && !articleError && !slugMismatch && article &&
                <Footer />}

        </div>


    );
}

export default Article;