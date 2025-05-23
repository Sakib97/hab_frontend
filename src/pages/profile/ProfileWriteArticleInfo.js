import { Select } from "antd";
import { DownOutlined } from '@ant-design/icons';
import styles from '../../css/ProfileWrite.module.css'
import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { franc } from 'franc-min'
import toast, { Toaster } from 'react-hot-toast';
import Divider from '@mui/material/Divider';
import useFetch from "../../hooks/useFetch";
import axios, { axiosPrivate } from "../../api/axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useQuery } from "react-query";
import { useLocation } from "react-router-dom";
import { fetchData } from "../../utils/getDataUtil";
import { cleanedTags } from "../../utils/slugAndStringUtil";

const ProfileWriteArticleInfo = forwardRef(({ finalArticleInfo, isEditable,
    editableArticle }, ref) => {
    // console.log("isEditable ", isEditable);
    const GET_MENU_URL = '/api/v1/category/get_all_cat'
    const GET_SUBMENU_URL = '/api/v1/category/get_all_subcat'
    const GET_TAG_URL = '/api/v1/category/get_all_tag'

    const DRAFT_ARTICLE_INFO = "draftArticleInfo";
    // const EDITABLE_DRAFT_ARTICLE_INFO = "editableDraftArticleInfo";

    // const [tags, setTags] = useState([])
    const [tags, setTags] = useState(
        isEditable && editableArticle?.article?.tags
            ? cleanedTags(editableArticle.article.tags)
            : []
    );

    const [newTag, setNewTag] = useState([])
    const [isNewTagVisible, setIsNewTagVisible] = useState(false);
    const [isOldTagDisabled, setIsOldTagDisabled] = useState(false);

    const [category, setCategory] = useState()
    const [subCategory, setSubCategory] = useState()
    const [categoryID, setCategoryID] = useState()
    const [subcategoryID, setSubCategoryID] = useState()

    // const [titleEN, setTitleEN] = useState('')
    const [titleEN, setTitleEN] = useState(
        isEditable && editableArticle?.article?.title_en
            ? editableArticle.article.title_en
            : ''
    );
    // const [subtitleEN, setSubtitleEN] = useState('')
    const [subtitleEN, setSubtitleEN] = useState(
        isEditable && editableArticle?.article?.subtitle_en
            ? editableArticle.article.subtitle_en
            : ''
    );
    const [titleBN, setTitleBN] = useState(
        isEditable && editableArticle?.article?.title_bn
            ? editableArticle.article.title_bn
            : ''
    );
    const [subtitleBN, setSubtitleBN] = useState(
        isEditable && editableArticle?.article?.subtitle_bn
            ? editableArticle.article.subtitle_bn
            : ''
    );


    // const [coverImgLink, setCoverImgLink] = useState('')
    const [coverImgLink, setCoverImgLink] = useState(
        isEditable && editableArticle?.article?.cover_img_link
            ? editableArticle.article.cover_img_link
            : ''
    );

    // const [coverImgCapEN, setCoverImgCapEN] = useState('')
    const [coverImgCapEN, setCoverImgCapEN] = useState(
        isEditable && editableArticle?.article?.cover_img_cap_en
            ? editableArticle.article.cover_img_cap_en
            : ''
    );
    // const [coverImgCapBN, setCoverImgCapBN] = useState('')
    const [coverImgCapBN, setCoverImgCapBN] = useState(
        isEditable && editableArticle?.article?.cover_img_cap_bn
            ? editableArticle.article.cover_img_cap_bn
            : ''
    );

    const [draftInfo, setDraftInfo] = useState({})
    const [error, setError] = useState(false)

    // To Apply the blur() method to close all Select when the user scrolls
    // otherwise open menu scrolls up of navbar
    const selectRefs = useRef([]);  // Array of refs

    const location = useLocation();
    useEffect(() => {
        // Dismiss all toasts when the component is unmounted
        return () => {
            toast.remove();
        };
    }, [location]); // Runs on page navigation

    const detectLanguage = (text) => {
        const detectedLanguage = franc(text, { only: ['eng', 'ben'] })
        return detectedLanguage
    }

    const MAX_COUNT = 3;
    const MAX_COUNT_NEW_TAG = 1;
    const suffix = (
        <>
            <span>
                {tags.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );
    const suffix_new_tag = (
        <>
            <span>
                {newTag.length} / {MAX_COUNT_NEW_TAG}
            </span>
            <DownOutlined />
        </>
    );

    const toggleNewTagVisibility = () => {
        setTags([])
        // check if newTag is already set before, if so, make the select visible on load 
        // and don't clear it's state
        if (Array.isArray(newTag) && newTag.length !== 0) {
            // console.log("draftInfo.newTag:: ", newTag);
            setIsNewTagVisible(true);

        } else {
            setNewTag([]);
            setIsNewTagVisible(prevState => !prevState);
            setIsOldTagDisabled(prevState => !prevState);
        }
        // setIsNewTagVisible(prevState => !prevState);
        // setIsOldTagDisabled(prevState => !prevState);

    };

    // get all categories, sub cats and tags; 
    // useFetch(URL, false) means axiosPrivate is deactivated here
    const axiosInst = axios;
    const { data: catData, error: catError, isLoading: catLoading } = useQuery(
        ['menuData', GET_MENU_URL],
        () => fetchData(GET_MENU_URL, axiosInst),
        {
            staleTime: 60000,  // Example option: Cache data for 60 seconds
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );

    const { data: subCatData, error: subCatError, isLoading: subCatLoading } = useQuery(
        ['submenuData', GET_SUBMENU_URL],
        () => fetchData(GET_SUBMENU_URL, axiosInst),
        {
            staleTime: 60000,  // Example option: Cache data for 60 seconds
            refetchOnWindowFocus: false,  // Disable refetch on window focus
        }
    );

    const { data: tagData, error: tagError, isLoading: tagLoading } = useQuery(
        ['tagData', GET_TAG_URL],
        () => fetchData(GET_TAG_URL, axiosInst), {
        refetchOnWindowFocus: false,  // Disable refetch on window focus
    }
    );

    // const { data: catData, error: catError, isLoading: catLoading } = useFetch(GET_MENU_URL, false)
    // const { data: subCatData, error: subCatError, isLoading: subCatLoading } = useFetch(GET_SUBMENU_URL, false)
    // const { data: tagData, error: tagError, isLoading: tagLoading } = useFetch(GET_TAG_URL, false)

    // Sort the data by 'order' field before mapping
    const sortedCatData = Array.isArray(catData)
        ? [...catData].sort((a, b) => a.category_order - b.category_order)  // Sorting by order field
        : [];

    // Only select the enabled categories
    const filteredSortedCatData = sortedCatData.filter(cat => cat.is_enabled === true)
    // console.log("filteredSortedCatData", filteredSortedCatData)

    const menuOptions = filteredSortedCatData.map(category =>
    ({
        value: category.category_name,
        label: category.category_name
    })
    )

    const categoryNameIdMap = filteredSortedCatData.map(category =>
    ({
        id: category.category_id,
        name: category.category_name
    })
    )


    // get the subcats by category and then sort
    // Filter the enabled subcategory data based on the selected category
    const filteredSubCatData = Array.isArray(subCatData)
        ? subCatData.filter(subCategory =>
            subCategory.category_name === category && subCategory.is_enabled === true)
        : [];

    const sortedSubCatData = [...filteredSubCatData].sort((a, b) => a.subcategory_order - b.subcategory_order)

    // Map the filtered subcategories to Select options
    const subMenuOptions = sortedSubCatData.map(subCategory => ({
        value: subCategory.subcategory_name,
        label: subCategory.subcategory_name
    }));

    const subcategoryNameIdMap = sortedSubCatData.map(subCategory =>
    ({
        id: subCategory.subcategory_id,
        name: subCategory.subcategory_name,
    })
    )
    // console.log("subcategoryNameIdMap:: ", subcategoryNameIdMap);


    const tagOptions = Array.isArray(tagData) ?
        tagData.map(tag => ({
            value: tag.tag_name,
            label: tag.tag_name
        })) : [];

    // this useEffect is executed when we first come to this write page
    useEffect(() => {
        // localStorage.setItem(EDITABLE_DRAFT_ARTICLE_INFO, JSON.stringify(editableArticle));
        // if (isEditable) {
        //     const editableSavedInfo =localStorage.getItem(EDITABLE_DRAFT_ARTICLE_INFO);
        //     const editableParsedInfo = JSON.parse(editableSavedInfo);
        //     setSubtitleEN(editableParsedInfo.editor_email);
        // }

        const savedInfo = localStorage.getItem(DRAFT_ARTICLE_INFO);
        // console.log("SavedInfo:: ", savedInfo);

        if (savedInfo) {
            const parsedInfo = JSON.parse(savedInfo);
            finalArticleInfo(parsedInfo);

            setCategory(parsedInfo.category)
            setCategoryID(parsedInfo.categoryID)

            setSubCategory(parsedInfo.subCategory)
            setSubCategoryID(parsedInfo.subcategoryID)


            setTags(parsedInfo.tags)

            if (Array.isArray(parsedInfo.newTag) && parsedInfo.newTag.length !== 0) {
                setNewTag(parsedInfo.newTag)
                setIsNewTagVisible(true);
                setIsOldTagDisabled(true);
            }

            setTitleEN(String(parsedInfo.titleEN));
            setSubtitleEN(String(parsedInfo.subtitleEN))
            setTitleBN(String(parsedInfo.titleBN))
            setSubtitleBN(String(parsedInfo.subtitleBN))
            setCoverImgLink(String(parsedInfo.coverImgLink))
            setCoverImgCapEN(String(parsedInfo.coverImgCapEN))
            setCoverImgCapBN(String(parsedInfo.coverImgCapBN))
            setDraftInfo(parsedInfo);
        }

        // To close all Select when the user scrolls
        const handleScroll = () => {
            // On scroll, all the dropdowns are closed by calling the blur() method for each one.
            selectRefs.current.forEach(ref => {
                if (ref) ref.blur();
            });
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [])

    const handleCategoryChange = (category_name) => {
        setCategory(category_name);  // Update the selected category
        setSubCategory();  // Clear the selected subcategory
        const category_id = categoryNameIdMap.find(cat => cat.name === category_name)?.id
        setCategoryID(category_id)

    };

    const handleSubCategoryChange = (subcategory_name) => {
        setSubCategory(subcategory_name)
        const subcategory_id = subcategoryNameIdMap.find(subcat => subcat.name === subcategory_name)?.id
        setSubCategoryID(subcategory_id)
        // console.log("subcategory_id:: ", subcategory_id);
    }

    const handleTagsChange = (newTags) => {
        setTags(newTags);  // Update local state first
        // Optionally: Debounce or combine with other fields before sending to parent
    };

    const saveDraftInfo = () => {
        if (titleEN && detectLanguage(titleEN) !== 'eng') {
            setError(true)
            toast.error("Save Failed ! Incorrect English Title ! \nPrevious info will be retained (in any) !", { duration: 6000 });
            return;
        }
        if (subtitleEN && detectLanguage(subtitleEN) !== 'eng') {
            setError(true)
            toast.error("Save Failed ! Incorrect English SubTitle ! \nPrevious info will be retained (in any) !", { duration: 6000 });
            return;
        }
        if (titleBN && detectLanguage(titleBN) !== 'ben') {
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla Title ! \nPrevious info will be retained (in any) !", { duration: 6000 });
            return;
        }
        if (subtitleBN && detectLanguage(subtitleBN) !== 'ben') {
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla SubTitle ! \nPrevious info will be retained (in any) !", { duration: 6000 });
            return;
        }

        if (coverImgCapBN && detectLanguage(coverImgCapBN) !== 'ben') {
            setError(true)
            toast.error("Save Failed ! \n Incorrect Bangla Image Caption ! \n Previous info will be retained (in any) !", { duration: 6000 });
            return;
        }

        setError(false);

        const draftData = {
            category: (isEditable && editableArticle) ? editableArticle.category_name : category,
            subCategory: (isEditable && editableArticle) ? editableArticle.subcategory_name : subCategory,
            categoryID: (isEditable && editableArticle) ? editableArticle.article.category_id : categoryID,
            subcategoryID: (isEditable && editableArticle) ? editableArticle.article.subcategory_id : subcategoryID,
            tags, newTag: newTag ? newTag : '', titleEN, titleBN,
            subtitleEN, subtitleBN, coverImgLink, coverImgCapEN, coverImgCapBN
        };
        setDraftInfo(draftData);
        finalArticleInfo(draftData);

        if (!isEditable){
            localStorage.setItem(DRAFT_ARTICLE_INFO, JSON.stringify(draftData));
        }
        toast.success("Draft Info Saved!", { duration: 1000 });

        // console.log("info:: ", category, subCategory, tags, titleEN, titleBN, subtitleEN, subtitleBN);
    }

    const clearDraftInfo = () => {
        localStorage.removeItem(DRAFT_ARTICLE_INFO);
        setCategory()
        setSubCategory()
        setTags([])
        setNewTag([])
        setTitleEN('');
        setSubtitleEN('');
        setTitleBN('')
        setSubtitleBN('')
        setCoverImgLink('')
        setCoverImgCapEN('')
        setCoverImgCapBN('')
        setDraftInfo({});
        // toast.success("Draft Info Cleared !", { duration: 2000 })
        toast('Draft Info Cleared !',
            {
                icon: <i style={{ color: "red" }} className="fa-solid fa-trash-can"></i>,
                style: {
                    borderRadius: '10px',
                    background: '#fff',
                    color: 'black',
                },
                duration: 1000
            })
    }

    // Expose the resetFields method to the parent component
    useImperativeHandle(ref, () => ({
        articleInfoResetFields() {
            localStorage.removeItem(DRAFT_ARTICLE_INFO);
            setCategory()
            setSubCategory()
            setTags([])
            setNewTag([])
            setTitleEN('');
            setSubtitleEN('');
            setTitleBN('')
            setSubtitleBN('')
            setCoverImgLink('')
            setCoverImgCapEN('')
            setCoverImgCapBN('')
            setDraftInfo({});
        }
    }));

    return (
        <div className={styles.customFormPart}>
            <Toaster />
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Category *</label>
                    <Select
                        // For each <Select />, assign the element (el) 
                        // to the corresponding index in the selectRefs.current array.
                        ref={(el) => (selectRefs.current[0] = el)}
                        placeholder={catLoading ? "Loading.." :
                            catError ? "Server Error !" : "Select Category"}
                        style={{ width: 180 }}
                        // value={category}
                        value={(isEditable && editableArticle) ? editableArticle.category_name : category}
                        onChange={handleCategoryChange}
                        options={menuOptions}
                        disabled={isEditable}
                    />
                </div>

                {/* <div className={styles.verticalDivider}></div> */}
                <Divider orientation="vertical" flexItem />

                <div className={styles.formGroup}>
                    <label>Sub Category *</label>
                    <Select
                        ref={(el) => (selectRefs.current[1] = el)}
                        placeholder={subCatLoading ? "Loading.." :
                            subCatError ? "Server Error !" : "Select Sub Category"}
                        style={{ width: 180 }}
                        value={(isEditable && editableArticle) ? editableArticle.subcategory_name : subCategory}
                        onChange={handleSubCategoryChange}
                        options={subMenuOptions}
                        disabled={isEditable}
                    />
                </div>

                {/* <div className={styles.verticalDivider}></div> */}
                <Divider orientation="vertical" flexItem />

                <div className={styles.formGroup}>
                    <label>Tags </label>
                    <Select
                        ref={(el) => (selectRefs.current[2] = el)}
                        // key={tags.length} // Reset when tags change
                        mode="multiple"
                        disabled={isOldTagDisabled}
                        maxCount={MAX_COUNT}
                        value={tags}
                        // value={(isEditable && editableArticle)? cleanedTags(editableArticle.article.tags) : tags}
                        style={{ width: 250 }}
                        // onChange={setTags}
                        onChange={handleTagsChange}
                        suffixIcon={suffix}
                        placeholder={tagLoading ? "Loading.." :
                            tagError ? "Server Error !" : "Please select"}
                        options={tagOptions}
                    />
                    <span style={{ fontSize: "12px" }}>No Matching Tags?
                        <span onClick={toggleNewTagVisibility} style={{ cursor: 'pointer', color: 'blue' }}>
                            {isNewTagVisible ? ' Clear tag to Cancel' : ' Request one here'}
                        </span>
                    </span>

                    {/* New Tag */}
                    {isNewTagVisible && (
                        <Select
                            ref={(el) => (selectRefs.current[3] = el)}
                            mode="tags"
                            // disabled={isOldTagDisabled}
                            maxCount={MAX_COUNT_NEW_TAG}
                            value={newTag}
                            style={{ width: 250 }}
                            onChange={setNewTag}
                            suffixIcon={suffix_new_tag}
                            placeholder="Type a new tag"

                        />
                    )}


                </div>
            </div>
            <hr />
            {/* Second Row: Title (English), Sub Title (English) */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Title (English) *</label>
                    <input
                        type="text"
                        className={styles.customInput}
                        placeholder="Title (English)"
                        value={titleEN}
                        // value={(isEditable && editableArticle)? editableArticle.article.title_en : tags}
                        onChange={(e) => setTitleEN(e.target.value)}
                    // required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Sub Title (English) *</label>
                    <textarea
                        // required 
                        className={styles.customInput} rows="2"
                        placeholder=" No more than two lines..."
                        value={subtitleEN}
                        onChange={(e) => setSubtitleEN(e.target.value)} />
                </div>
            </div>
            <hr />
            {/* Third Row: Title (Bangla), Sub Title (Bangla) */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label className="bn"> বাংলা শিরোনাম *</label>
                    <input
                        // required 
                        type="text"
                        className={`${styles.customInput} bn`}
                        placeholder="বাংলা শিরোনাম"
                        value={titleBN}
                        onChange={(e) => setTitleBN(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label className="bn">বাংলা উপ-শিরোনাম *</label>
                    <textarea
                        // required 
                        className={`${styles.customInput} bn`}
                        rows="2" placeholder="দুই লাইন..."
                        value={subtitleBN}
                        onChange={(e) => setSubtitleBN(e.target.value)} />
                </div>
            </div>
            <hr />

            {/* Fourth Row: Cover Inage */}
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Cover Image Link *</label>
                    <input
                        type="text"
                        className={styles.customInput}
                        placeholder="https://i.ibb.co.com/v3bscpR/home.jpg"
                        value={coverImgLink}
                        onChange={(e) => setCoverImgLink(e.target.value)}
                    // required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label >Cover Image Caption (English) *</label>
                    <textarea
                        // required 
                        className={styles.customInput} rows="2"
                        placeholder="Image Caption"
                        value={coverImgCapEN}
                        onChange={(e) => setCoverImgCapEN(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label className="bn">বাংলায় কভার ছবির ক্যাপশন *</label>
                    <textarea
                        // required 
                        className={`${styles.customInput} bn`} rows="2"
                        placeholder="ছবির ক্যাপশন"
                        value={coverImgCapBN}
                        onChange={(e) => setCoverImgCapBN(e.target.value)} />
                </div>
            </div>
            <hr />

            {/* {isEditable ? '' : */}
                <div style={{ marginTop: "-10px", display: "flex", justifyContent: "center" }}>
                <button name="saveDraftInfo"
                    className='btn btn-success'
                    onClick={saveDraftInfo}> <i className="fa-solid fa-floppy-disk"></i> Save Draft Info </button> &nbsp;&nbsp;

                <button name="clearDraftInfo"
                    className='btn btn-danger'
                    onClick={clearDraftInfo}> <i className="fa-regular fa-trash-can"></i> Clear Draft Info </button>
            </div> 
            {/* } */}
        </div>
    );
})

export default ProfileWriteArticleInfo;