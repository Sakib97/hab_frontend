import { Select } from "antd";
import { DownOutlined } from '@ant-design/icons';
import styles from '../../css/ProfileWrite.module.css'
import { useState, useEffect } from "react";
import { franc } from 'franc-min'
import toast, { Toaster } from 'react-hot-toast';

const ProfileWriteArticleInfo = () => {
    const DRAFT_ARTICLE_INFO = "draftArticleInfo";

    const [tags, setTags] = useState([])
    const [menu, setMenu] = useState()
    const [subMenu, setSubMenu] = useState()
    const [titleEN, setTitleEN] = useState('')
    const [subtitleEN, setSubtitleEN] = useState('')
    const [titleBN, setTitleBN] = useState('')
    const [subtitleBN, setSubtitleBN] = useState('')
    const [draftInfo, setDraftInfo] = useState({})

    const [error, setError] = useState(false)

    const detectLanguage = (text)=>{
        const detectedLanguage = franc(text , {only: ['eng', 'ben']})
        return detectedLanguage
    }

    useEffect(()=>{
        const savedInfo = localStorage.getItem(DRAFT_ARTICLE_INFO);
        // console.log("SavedInfo:: ", savedInfo);

        if(savedInfo){
            const parsedInfo = JSON.parse(savedInfo);
            setMenu(parsedInfo.menu)
            setSubMenu(parsedInfo.subMenu)
            setTags(parsedInfo.tags)
            setTitleEN(String(parsedInfo.titleEN)); 
            setSubtitleEN(String(parsedInfo.subtitleEN))
            setTitleBN(String(parsedInfo.titleBN))
            setSubtitleBN(String(parsedInfo.subtitleBN))
            setDraftInfo(parsedInfo);
        }
    },[])

    const MAX_COUNT = 3;
    const suffix = (
        <>
            <span>
                {tags.length} / {MAX_COUNT}
            </span>
            <DownOutlined />
        </>
    );

    
    const saveDraftInfo = () => {
        if (titleEN && detectLanguage(titleEN) != 'eng'){
            setError(true) 
            toast.error("Save Failed ! Incorrect English Title !", { duration: 4000 });
            return;
        }
        if (subtitleEN && detectLanguage(subtitleEN) != 'eng'){
            setError(true)
            toast.error("Save Failed ! Incorrect English SubTitle !", { duration: 4000 });
            return;
        }
        if (titleBN && detectLanguage(titleBN) != 'ben'){
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla Title !", { duration: 4000 });
            return;
        }
        if (subtitleBN && detectLanguage(subtitleBN) != 'ben'){
            setError(true)
            toast.error("Save Failed ! Incorrect Bangla SubTitle !", { duration: 4000 });
            return;
        }
    
        setError(false);

        const draftData = { menu, subMenu, tags, titleEN, titleBN, subtitleEN, subtitleBN }; 
        setDraftInfo(draftData); 

        // Save directly to localStorage
        localStorage.setItem(DRAFT_ARTICLE_INFO, JSON.stringify(draftData));
        toast.success("Draft Info Saved!", { duration: 2000 });
       
        console.log("info:: ", menu, subMenu, tags, titleEN, titleBN, subtitleEN, subtitleBN);
    }

    const clearDraftInfo = ()=>{
        localStorage.removeItem(DRAFT_ARTICLE_INFO);
        setMenu()
        setSubMenu()
        setTags([])
        setTitleEN(''); 
        setSubtitleEN('')
        setTitleBN('')
        setSubtitleBN('')
        setDraftInfo({});
        // toast.success("Draft Info Cleared !", { duration: 2000 })
        toast('Draft Info Cleared !',
            {
              icon: <i style={{color:"red"}} className="fa-solid fa-trash-can"></i>,
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
                    <label>Menu *</label>
                    <Select
                        placeholder="Select Menu"
                        style={{ width: 180 }}
                        value={menu}
                        onChange={setMenu}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' }]}
                    />
                </div>

                <div className={styles.verticalDivider}></div>

                <div className={styles.formGroup}>
                    <label>Sub Menu *</label>
                    <Select
                        placeholder="Select Sub Menu"
                        style={{ width: 180 }}
                        value={subMenu}
                        onChange={setSubMenu}
                        options={[
                            { value: 'jack', label: 'Jack' },
                            { value: 'lucy', label: 'Lucy' }]}
                    />
                </div>
                <div className={styles.verticalDivider}></div>

                <div className={styles.formGroup}>
                    <label>Tags *</label>
                    <Select
                        mode="multiple"
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
                        onChange={(e)=>setTitleEN(e.target.value)}
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
                        onChange={(e)=>setSubtitleEN(e.target.value)}/>
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
                        onChange={(e)=>setTitleBN(e.target.value)}/>
                </div>

                <div className={styles.formGroup}>
                    <label className="bn">বাংলা উপ-শিরোনাম *</label>
                    <textarea 
                        // required 
                        className={`${styles.customInput} bn`} 
                        rows="2" placeholder="দুই লাইন..." 
                        value={subtitleBN}
                        onChange={(e)=>setSubtitleBN(e.target.value)}/>
                </div>
            </div>
            <hr />
            <div style={{ marginTop: "-10px", display: "flex", justifyContent: "center" }}>
                <button name="saveDraftInfo"
                    className='btn btn-success'
                    onClick={saveDraftInfo}> Save Draft Info </button> &nbsp;&nbsp;
                
                <button name="clearDraftInfo" 
                    className='btn btn-danger'
                    onClick={clearDraftInfo}> Clear Draft Info </button>
            </div>
        </div>
    );
}

export default ProfileWriteArticleInfo;