import styles from '../../../css/EditorProfile.module.css'
import { Link } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';
import useProfileContext from '../../../hooks/useProfileContext';
import { useQuery } from 'react-query';
import { fetchData } from '../../../utils/getDataUtil';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import Tree from 'antd/es/tree/Tree';
import { useState, useEffect } from 'react';
import { slugify } from '../../../utils/slugAndStringUtil';

const EditorProfile = () => {
    const { auth } = useAuth()
    const editor_email = auth?.email
    const { profile, setProfile } = useProfileContext()
    const GET_CAT_SUBCAT_URL = `/api/v1/category/get_all_cat_subcat_by_email/editor/${editor_email}`
    const GET_UNDER_REVIEW_ARTICLES_COUNT_URL = `/api/v1/article/article_count/under_review/editor/${editor_email}`
    const GET_REVIEWED_ARTICLES_COUNT_URL = `/api/v1/article/article_count/reviewed/editor/${editor_email}`
    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    const { data: editorAllCatSubcatData, error: editorAllCatSubcatError,
        isLoading: editorAllCatSubcatLoading } = useQuery(
            ['editorAllCatSubcatData', GET_CAT_SUBCAT_URL],
            () => fetchData(GET_CAT_SUBCAT_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const { data: editorUnRevArtCount, error: editorUnRevArtCountError,
        isLoading: editorUnRevArtCountLoading } = useQuery(
            ['editorUnRevArtCount', GET_UNDER_REVIEW_ARTICLES_COUNT_URL],
            () => fetchData(GET_UNDER_REVIEW_ARTICLES_COUNT_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

        const { data: editorRevArtCount, error: editorRevArtCountError,
            isLoading: editorRevArtCountLoading } = useQuery(
                ['editorRevArtCount', GET_REVIEWED_ARTICLES_COUNT_URL],
                () => fetchData(GET_REVIEWED_ARTICLES_COUNT_URL, axiosInst),
                {
                    keepPreviousData: true, // Preserve previous data while fetching new
                    // staleTime: 600,  // Example option: Cache data for 6 seconds
                    refetchOnWindowFocus: false,  // Disable refetch on window focus
                }
            );

    // Transform data to Ant Design Tree format
    const transformDataToTree = (data) => {
        return Object.keys(data).map((key, index) => {
            const children = data[key].map((item, childIndex) => ({
                title: <Link
                    to={`/category/${slugify(key)}/${slugify(item)}`}
                    style={{ color: 'black', textDecoration: 'none' }}
                >
                    {item}
                </Link>,
                key: `${index}-${childIndex}`, // Unique key for child node
            }));

            return {
                title: <Link
                    to={`/category/${slugify(key)}`}
                    style={{ color: 'black', textDecoration: 'none' }}
                >
                    {key}
                </Link>,
                key: `${index}`, // Unique key for parent node
                children: children.length > 0 ? children : undefined, // Only include children if non-empty
            };
        });
    };

    const [treeData, setTreeData] = useState([]); // State to hold transformed tree data
    useEffect(() => {
        if (editorAllCatSubcatData) {
            const transformedData = transformDataToTree(editorAllCatSubcatData);
            setTreeData(transformedData);
        } else {
            setTreeData([]); // Reset treeData if data is undefined
        }
    }, [editorAllCatSubcatData]); // Run when editorAllCatSubcatData changes

    return (
        <div className={`${styles.outerProfileContainer}`}>

            {/* Editor Home */}
            <div className={`${styles.profileInfoContainer}`}>
                <div className={`${styles.profileImageContainer}`}>
                    <img className={`${styles.profileImageContainer}`} src="https://picsum.photos/200/300" alt="" />
                </div>
                <div className={`${styles.profileNameContainer}`}>
                    Welcome, <b>{profile?.first_name} {profile?.last_name}</b>!
                </div>


            </div>

            <div className={`${styles.messageContainer}`}>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                    Message from Admin
                </div>
                <div style={{ fontSize: '18px', margin: '10px 0 10px 0' }}>
                    Eid Mubarak 
                </div>
                <div style={{ fontSize: '14px', color: "grey" }}>
                    <i class="fa-regular fa-clock"></i> &nbsp;
                    7 April 2025, 10:30 PM
                </div>
            </div>

            <div className={`${styles.secondRowContainer}`}>
                <div className={`${styles.authCategoryContainer}`}>

                    <div className={`${styles.authCategoryHeading}`}>
                        Authorized Categories
                    </div>
                    <div className={`${styles.authCategoryList}`}>

                        {editorAllCatSubcatLoading ?
                            <span style={{ fontSize: "18px" }}>Loading...</span> :
                            editorAllCatSubcatError ?
                                <span style={{ fontSize: "18px", color: "red", fontWeight: "bold" }}>Error Loading Categories !</span> : <Tree
                                    className={`${styles.authCategoryTree}`}
                                    showLine={{ showLeafIcon: false }}
                                    treeData={treeData} />}
                    </div>
                </div>

                <div className={`${styles.awaitReviewContainer}`}>
                    <div className={`${styles.authCategoryHeading}`}>
                        Articles Awaiting Review
                    </div>
                    <div className={`${styles.awaitNumber}`}>
                        {editorUnRevArtCountLoading ?
                            <span style={{ fontSize: "18px" }}>Loading...</span> :
                            editorUnRevArtCountError ?
                                <span style={{ fontSize: "18px", color: "red", fontWeight: "bold" }}>
                                    Error Loading Count !</span> :
                                // padStart count is shows “01” instead of “1”
                                String(editorUnRevArtCount?.totalCount).padStart(2, '0')}
                        {/* 03 */}
                    </div>
                    <div className={`${styles.awaitButtonContainer}`}>
                        {/* <button className={`${styles.awaitButton}`}> */}
                        <Link className={`${styles.awaitButton}`}
                            to="/editor_dashboard/review/unreviwed-articles">
                            Go to Review
                        </Link>
                        {/* </button> */}
                    </div>

                </div>
            </div>

            <div className={`${styles.thirdRowContainer}`}>
                <div className={`${styles.totalReviewContainer}`}>
                    <div className={`${styles.authCategoryHeading}`}>
                        Total Reviewed Articles
                    </div>
                    <div className={`${styles.awaitNumber}`}>
                        {editorRevArtCountLoading ? 
                            <span style={{ fontSize: "18px" }}>Loading...</span> :
                            editorRevArtCountError ?
                                <span style={{ fontSize: "18px", color: "red", fontWeight: "bold" }}>
                                    Error Loading Count !</span> :
                                // padStart count is shows “01” instead of “1”
                                String(editorRevArtCount?.totalCount).padStart(2, '0')}
                        
                    </div>
                    <div className={`${styles.awaitButtonContainer}`}>
                        <Link className={`${styles.awaitButton}`}
                            to="/editor_dashboard/review/review-history">
                            Go to History
                        </Link>
                    </div>
                </div>

                <div className={`${styles.newAuthContainer}`}>
                    <div className={`${styles.authCategoryHeading}`}>
                        Want new category or subcategory ?
                    </div>
                    <div className={`${styles.textContainer}`}>
                        Write a note to Admin mentioning the
                        category / subcategory name and what interests you
                        about this topic.
                    </div>
                    <div className={`${styles.awaitButtonContainer}`}>
                        <button className={`${styles.awaitButton}`}>
                            Write a note
                        </button>
                    </div>
                </div>

                <div className={`${styles.hideArticleContainer}`}>
                    <div className={`${styles.authCategoryHeading}`}>
                        Hide Article ?
                    </div>
                    <div className={`${styles.textContainer}`}>
                        Need to hide any
                        article you reviewed
                        temporarily ?
                    </div>
                    <div className={`${styles.awaitButtonContainer}`}>
                        <button className={`${styles.awaitButton}`}>
                            Go to Hide
                        </button>
                    </div>
                </div>

            </div>


        </div>);
}

export default EditorProfile;