import styles from '../../../css/RTE.module.css'
import { useRef, useState, useEffect, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import toast, { Toaster } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { useLocation } from 'react-router-dom';

const RichTextEditor = ({ language, onChange }) => {
    const DRAFT_ARTICLE_EN = "draftArticleEn";
    const DRAFT_ARTICLE_BN = "draftArticleBn";

    // const editor = useRef(null);
    const [content, setContent] = useState('');
    // content2 needed to solve JoditEditor typing issue
    const [content2, setContent2] = useState('');
    const [isLangEN, setIsLangEN] = useState(false)
    const [isLangBN, setIsLangBN] = useState(false)
    const [removeButtonList, setRemoveButtonList] = useState([])


    // Load content from localStorage when the component mounts
    useEffect(() => {
        let savedContent;
        if (language === 'en') {
            setIsLangEN(true)
            setIsLangBN(false)
            savedContent = localStorage.getItem(DRAFT_ARTICLE_EN);
            setRemoveButtonList(['speechRecognize', 'about', 'copyformat', 'classSpan', 'ai-commands', 'ai-assistant'])
        } else if (language === 'bn') {
            setIsLangEN(false)
            setIsLangBN(true)
            savedContent = localStorage.getItem(DRAFT_ARTICLE_BN);
            setRemoveButtonList(['font', 'speechRecognize', 'about', 'copyformat', 'classSpan', 'ai-commands', 'ai-assistant'])
        }
        if (savedContent) {
            setContent(savedContent);
            setContent2(savedContent);
            onChange(savedContent);
        }
    }, []);

    const location = useLocation();
    useEffect(() => {
        // Dismiss all toasts when the component is unmounted
        return () => {
          toast.remove();
        };
      }, [location]); // Runs on page navigation

    // IMP::: https://xdsoft.net/jodit/play.html
    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        autofocus: true,
        placeholder: language==='en' ? 'Start Article Body...' : 'লিখা শুরু করুন...',
        minHeight: 500,
        maxHeight: 600,
        // minWidth: 400,
        maxWidth: 800,
        toolbarStickyOffset: 50,
        // removeButtons: removeButtonList, 
        removeButtons: ['font', 'speechRecognize', 'about', 'copyformat', 'classSpan', 'ai-commands', 'ai-assistant'], 
        events: {
            error: (error) => {
                // Handle the error
                console.error("Jodit Editor Error:", error);
                toast.error("An error occurred in the editor.", { duration: 2000 });
            },
        },
        
        statusbar: false,
        toolbarAdaptive: false,
        // toolbarAdaptive: true,

    }),
        []
    );

    const handleEditorChange = (newContent) => {
        setContent(newContent);  // Update the state with the new content
        onChange(newContent); // Call the parent's onChange to lift the state up
        
    };

    const saveDraft = () => {
        setContent2(content);
        if (isLangEN) {
            localStorage.setItem(DRAFT_ARTICLE_EN, content)
            toast.success("English Draft Article Saved !", { duration: 1000 });
        }
        if (isLangBN) {
            localStorage.setItem(DRAFT_ARTICLE_BN, content)
            toast.success("বাংলা খসড়া সেভ হয়েছে !", { duration: 1000 });
        }

    }

    //Clear the draft from localStorage
    const clearDraft = () => {
        let toastMsg;
        setContent2('');
        setContent('');
        if (isLangEN) {
            localStorage.removeItem(DRAFT_ARTICLE_EN);
            toastMsg = 'English Draft Article Cleared !'
        }
        if (isLangBN) {
            localStorage.removeItem(DRAFT_ARTICLE_BN);
            toastMsg = 'বাংলা খসড়া ক্লিয়ার হয়েছে !'
        }
        toast(toastMsg,
            {
                icon: <i style={{ color: "red" }} className="fa-solid fa-trash-can"></i>,
                style: {
                    borderRadius: '10px',
                    background: '#fff',
                    color: 'black',
                },
                duration: 1000
            })
    };

    const getHTMLContent = () => {
        const sanitizedContent = DOMPurify.sanitize(content);
        const jsonData = {
            content: sanitizedContent,
        };
        const jsonString = JSON.stringify(jsonData);

        console.log("Saved JSON:", jsonString);
        console.log("sanitizedContent htmlContent::", sanitizedContent);  // You can also use it elsewhere in your application
        console.log("htmlContent::", content);  // You can also use it elsewhere in your application
    };

    const renderHTMLContent = () => {
        return { __html: content };  // Prepare the HTML content for rendering
    };

    return (
        <div>
            <div className={`${styles.editor}`} >
                <div><Toaster /></div>

                <JoditEditor
                    // ref={editor}
                    value={content2}
                    config={config}
                    // onFocus = {newContent => handleEditorChange(newContent)}
                    onChange={newContent => handleEditorChange(newContent)}
                    // onChange={value => setContent(value)}
                    onBlur={newContent => setContent2(newContent? newContent : "write")}
                    // onFocus={newContent => setContent2(newContent)}
                    // onClick={value => setContent2(value)}
                // onChange={newContent => {const newC = newContent;}}
                />

                <div style={{ marginTop: "10px", display: "flex", justifyContent: "center" }}>
                    <button type="submit" name="saveDraftEN"
                        onClick={saveDraft} className='btn btn-success'>
                        <i className="fa-solid fa-floppy-disk"></i>
                        <span className={isLangBN ? 'bn' : ''}>
                            {isLangEN ? ' Save Draft' : ' ড্রাফট সেভ'}
                        </span>
                    </button> &nbsp;&nbsp;

                    <button type="submit" name="clearDraftEN"
                        onClick={clearDraft} className='btn btn-danger'>
                        <i className="fa-regular fa-trash-can"></i>
                        <span className={isLangBN ? 'bn' : ''}>
                            {isLangEN ? ' Clear Draft' : ' ড্রাফট ক্লিয়ার'}
                        </span>
                    </button>
                </div>

            </div>
            {/* <button onClick={getHTMLContent}>Get HTML Content</button>

            <h2>Rendered Preview:</h2>
            <h3 className={styles.bn}>প্রিভিউ:  </h3>

            <div
                dangerouslySetInnerHTML={renderHTMLContent()}  // Render the HTML content
            /> */}
        </div>
    );
}

export default RichTextEditor;

