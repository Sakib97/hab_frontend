import { Select } from "antd";
import { DownOutlined } from '@ant-design/icons';
import styles from '../../css/ProfileWrite.module.css'
import { useState, useEffect } from "react";
import { franc } from 'franc-min'
import toast, { Toaster } from 'react-hot-toast';
import Divider from '@mui/material/Divider';
import useFetch from "../../hooks/useFetch";

const ProfileWriteArticleInfo = () => {
    const GET_MENU_URL = '/api/v1/category/get_all_cat'
    const GET_SUBMENU_URL = '/api/v1/category/get_all_subcat'
    const DRAFT_ARTICLE_INFO = "draftArticleInfo";

    const [tags, setTags] = useState([])
    const [isNewTagVisible, setIsNewTagVisible] = useState(false);
    const [isOldTagDisabled, setIsOldTagDisabled] = useState(false);


    const [category, setCategory] = useState()
    const [subCategory, setSubCategory] = useState()
    const [titleEN, setTitleEN] = useState('')
    const [subtitleEN, setSubtitleEN] = useState('')
    const [titleBN, setTitleBN] = useState('')
    const [subtitleBN, setSubtitleBN] = useState('')
    const [draftInfo, setDraftInfo] = useState({})

    const [error, setError] = useState(false)

    const detectLanguage = (text) => {
        const detectedLanguage = franc(text, { only: ['eng', 'ben'] })
        return detectedLanguage
    }

    useEffect(() => {
        const savedInfo = localStorage.getItem(DRAFT_ARTICLE_INFO);
        // console.log("SavedInfo:: ", savedInfo);

        if (savedInfo) {
            const parsedInfo = JSON.parse(savedInfo);
            setCategory(parsedInfo.category)
            setSubCategory(parsedInfo.subCategory)
            setTags(parsedInfo.tags)
            setTitleEN(String(parsedInfo.titleEN));
            setSubtitleEN(String(parsedInfo.subtitleEN))
            setTitleBN(String(parsedInfo.titleBN))
            setSubtitleBN(String(parsedInfo.subtitleBN))
            setDraftInfo(parsedInfo);
        }
    }, [])

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
                {tags.length} / {MAX_COUNT_NEW_TAG}
            </span>
            <DownOutlined />
        </>
    );

    const toggleNewTagVisibility = () => {
        setIsNewTagVisible(prevState => !prevState);
        setIsOldTagDisabled(prevState => !prevState);
    };

    // get all categories
    const { data: catData, error: catError, isLoading: catLoading } = useFetch(GET_MENU_URL, false)
    const { data: subCatData, error: subCatError, isLoading: subCatLoading } = useFetch(GET_SUBMENU_URL, false)

    // Sort the data by 'order' field before mapping
    const sortedCatData = Array.isArray(catData)
        ? [...catData].sort((a, b) => a.category_order - b.category_order)  // Sorting by order field
        : [];

    const menuOptions = sortedCatData.map(category => ({
        value: category.category_name,  // Use the category's id as the value
        label: category.category_name,  // Use the category's name as the label
    }))

    // get the subcats by category and then sort
    // Filter the subcategory data based on the selected category
    const filteredSubCatData = Array.isArray(subCatData)
        ? subCatData.filter(subCategory => subCategory.category_name === category)
        : [];
    const sortedSubCatData = [...filteredSubCatData].sort((a, b) => a.subcategory_order - b.subcategory_order)
    // console.log("sortedSubCatData", sortedSubCatData);

    // Map the filtered subcategories to Select options
    const subMenuOptions = sortedSubCatData.map(subCategory => ({
        value: subCategory.subcategory_name,
        label: subCategory.subcategory_name
    }));

    const handleCategoryChange = (category_name) => {
        setCategory(category_name);  // Update the selected category
        setSubCategory();  // Clear the selected subcategory
    };


    const saveDraftInfo = () => {
        if (titleEN && detectLanguage(titleEN) !== 'eng') {
            setError(true)
            toast.error("Save Failed ! Incorrect English Title !", { duration: 4000 });
            return;
        }
        if (subtitleEN && detectLanguage(subtitleEN) !== 'eng') {
            setError(true)
            toast.error("Save Failed ! Incorrect English SubTitle !", { duration: 4000 });
            return;
        }
        if (titleBN && detectLanguage(titleBN) !== 'ben') {
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla Title !", { duration: 4000 });
            return;
        }
        if (subtitleBN && detectLanguage(subtitleBN) !== 'ben') {
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla SubTitle !", { duration: 4000 });
            return;
        }

        setError(false);

        const draftData = { category: category, subCategory: subCategory, tags, titleEN, titleBN, subtitleEN, subtitleBN };
        setDraftInfo(draftData);

        // Save directly to localStorage
        localStorage.setItem(DRAFT_ARTICLE_INFO, JSON.stringify(draftData));
        toast.success("Draft Info Saved!", { duration: 2000 });

        console.log("info:: ", category, subCategory, tags, titleEN, titleBN, subtitleEN, subtitleBN);
    }

    const clearDraftInfo = () => {
        localStorage.removeItem(DRAFT_ARTICLE_INFO);
        setCategory()
        setSubCategory()
        setTags([])
        setTitleEN('');
        setSubtitleEN('');
        setTitleBN('')
        setSubtitleBN('')
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
            })
    }

    return (
        <div className={styles.customFormPart}>
            <div><Toaster /></div>
            <div className={styles.formRow}>
                <div className={styles.formGroup}>
                    <label>Category *</label>
                    <Select
                        placeholder="Select Category"
                        style={{ width: 180 }}
                        value={category}
                        onChange={handleCategoryChange}
                        options={menuOptions}
                    />
                </div>

                {/* <div className={styles.verticalDivider}></div> */}
                <Divider orientation="vertical" flexItem />

                <div className={styles.formGroup}>
                    <label>Sub Category *</label>
                    <Select
                        placeholder="Select Sub Category"
                        style={{ width: 180 }}
                        value={subCategory}
                        onChange={setSubCategory}
                        options={subMenuOptions}
                    />
                </div>

                {/* <div className={styles.verticalDivider}></div> */}
                <Divider orientation="vertical" flexItem />

                <div className={styles.formGroup}>
                    <label>Tags </label>
                    <Select
                        mode="multiple"
                        disabled={isOldTagDisabled}
                        maxCount={MAX_COUNT}
                        value={tags}
                        style={{ width: 250 }}
                        onChange={setTags}
                        suffixIcon={suffix}
                        placeholder="Please select"
                        options={[
                            { value: 'Ava Swift', label: 'Ava Swift' },
                            { value: 'Cole Reed', label: 'Cole Reed' },
                            { value: 'Mia Blake', label: 'Mia Blake' },
                            { value: 'Jake Stone', label: 'Jake Stone' },
                            { value: 'Lily Lane', label: 'Lily Lane' }
                        ]}
                    />
                    <span style={{ fontSize: "12px" }}>No Matching Tags?
                        <span onClick={toggleNewTagVisibility} style={{ cursor: 'pointer', color: 'blue' }}>
                            {isNewTagVisible ? ' Cancel' : ' Request one here'}
                        </span>
                    </span>
                    {isNewTagVisible && (
                        <Select
                            mode="tags"
                            // disabled={isOldTagDisabled}
                            maxCount={MAX_COUNT_NEW_TAG}
                            value={tags}
                            style={{ width: 250 }}
                            onChange={setTags}
                            suffixIcon={suffix_new_tag}
                            placeholder="Please select"
                            // options={[
                            //     { value: 'Ava Swift', label: 'Ava Swift' },
                            //     { value: 'Cole Reed', label: 'Cole Reed' },
                            //     { value: 'Mia Blake', label: 'Mia Blake' },
                            //     { value: 'Jake Stone', label: 'Jake Stone' },
                            //     { value: 'Lily Lane', label: 'Lily Lane' }
                            // ]}
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
                        placeholder="https://i.imgur.com/Hu9L5RH.jpg"
                        value={titleEN}
                        onChange={(e) => setTitleEN(e.target.value)}
                    // required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label >Cover Image Caption (English) *</label>
                    <textarea
                        // required 
                        className={styles.customInput} rows="2"
                        placeholder="Image Caption"
                        value={subtitleEN}
                        onChange={(e) => setSubtitleEN(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label className="bn">বাংলায় কভার ছবির ক্যাপশন *</label>
                    <textarea
                        // required 
                        className={`${styles.customInput} bn`} rows="2"
                        placeholder="ছবির ক্যাপশন"
                        value={subtitleEN}
                        onChange={(e) => setSubtitleEN(e.target.value)} />
                </div>
            </div>
            <hr />

            <div style={{ marginTop: "-10px", display: "flex", justifyContent: "center" }}>
                <button name="saveDraftInfo"
                    className='btn btn-success'
                    onClick={saveDraftInfo}> <i className="fa-solid fa-floppy-disk"></i> Save Draft Info </button> &nbsp;&nbsp;

                <button name="clearDraftInfo"
                    className='btn btn-danger'
                    onClick={clearDraftInfo}> <i className="fa-regular fa-trash-can"></i> Clear Draft Info </button>
            </div>
        </div>
    );
}

export default ProfileWriteArticleInfo;