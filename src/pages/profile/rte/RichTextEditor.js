import styles from '../../../css/RTE.module.css'
import { forwardRef, useImperativeHandle, useState, useEffect, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import toast, { Toaster } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { useLocation } from 'react-router-dom';
import { poweredByJodit } from 'jodit/esm/plugins/powered-by-jodit/powered-by-jodit';

// Use forwardRef to allow parent to access child methods
const RichTextEditor = forwardRef(({ language, onChange, isEditable, editableArticle }, ref) => {
    // console.log("RTE", isEditable, editableArticle);

    const DRAFT_ARTICLE_EN = "draftArticleEn";
    const DRAFT_ARTICLE_BN = "draftArticleBn";

    // const editor = useRef(null);
    const [content, setContent] = useState('');
    // content2 needed to solve JoditEditor typing issue
    const [content2, setContent2] = useState('');
    const [isLangEN, setIsLangEN] = useState(false)
    const [isLangBN, setIsLangBN] = useState(false)

    const location = useLocation();
    // Load content from localStorage when the component mounts
    useEffect(() => {
        let isMounted = true;
        let savedContent;
        if (language === 'en') {
            setIsLangEN(true)
            setIsLangBN(false)
            savedContent = localStorage.getItem(DRAFT_ARTICLE_EN);
        } else if (language === 'bn') {
            setIsLangEN(false)
            setIsLangBN(true)
            savedContent = localStorage.getItem(DRAFT_ARTICLE_BN);
        }
        // if (savedContent  && isMounted) {
        if (savedContent) {
            setContent(savedContent);
            setContent2(savedContent);
            onChange(savedContent);
        }
        if (isEditable && editableArticle) {
            if (language === 'en') {
                setContent(editableArticle.article.content_en);
                setContent2(editableArticle.article.content_en);
                onChange(editableArticle.article.content_en);
            }

            if (language === 'bn') {
                setContent(editableArticle.article.content_bn);
                setContent2(editableArticle.article.content_bn);
                onChange(editableArticle.article.content_bn);
            }


        }
        return () => {
            isMounted = false;
        }
        // }, [onChange, location]);
    }, []);


    useEffect(() => {

        // Dismiss all toasts when the component is unmounted
        return () => {
            toast.remove();
        };
    }, [location]); // Runs on page navigation

    // IMP::: https://xdsoft.net/jodit/play.html
    const isContent = () => {
        if (language === 'en') {
            const savedContent1 = localStorage.getItem(DRAFT_ARTICLE_EN);
            if (savedContent1 != null) {
                return true;
            }
            return false;
        }
        if (language === 'bn') {
            const savedContent2 = localStorage.getItem(DRAFT_ARTICLE_BN);
            if (savedContent2 != null) {
                return true;
            }
            return false;
        }
        return false;
    }


    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        autofocus: false,
        placeholder: !isContent() ?
            language === 'en' ? 'Start Article Body...' : 'লিখা শুরু করুন...'
            : ' ',
        minHeight: 500,
        maxHeight: 600,
        // minWidth: 400,
        maxWidth: 800,
        toolbarStickyOffset: 50,
        removeButtons: language === 'bn' ?
            ['font', 'speechRecognize', 'about', 'copyformat', 'classSpan', 'source', 'ai-commands', 'ai-assistant']
            : ['speechRecognize', 'about', 'copyformat', 'classSpan', 'ai-commands', 'ai-assistant']
        ,
        events: {
            error: (error) => {
                // Handle the error
                console.error("Jodit Editor Error:", error);
                toast.error("An error occurred in the editor.", { duration: 2000 });
            },
        },
        // defaultMode: 3,
        statusbar: true,
        showXPathInStatusbar: false,
        showCharsCounter: false,
        hidePoweredByJodit: true,
        toolbarAdaptive: false,
        // toolbarAdaptive: true,
        controls: {
            paragraph: {
                list: ({
                    p: 'Pharagraph',
                    h1: 'Heading 1',
                    h2: 'Heading 2',
                    h3: 'Heading 3',
                    h4: 'Heading 4',
                    blockquote: 'Quote',
                    div: 'Div',
                    pre: 'Source code'
                })
            },

            // font: {
            //     list: {
            //         'Noto Serif Bengali, sherif': 'surjo',
            //         'Alkatra, system-ui': 'Alkatra',
            //         'Galada, cursive': 'Galada'
            //     }
            // },

            // classSpan: {
            //     list: {
            //         toc: 'tocccc'
            //     }
            // }
        },

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
            if (!isEditable) {
                localStorage.setItem(DRAFT_ARTICLE_EN, content)
            }
            toast.success("English Draft Article Saved !", { duration: 1000 });
        }
        if (isLangBN) {
            if (!isEditable) {
                localStorage.setItem(DRAFT_ARTICLE_BN, content)
            }
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

    // Expose the resetFields method to the parent component
    useImperativeHandle(ref, () => ({
        rteResetFields() {
            setContent2('');
            setContent('');
            localStorage.removeItem(DRAFT_ARTICLE_EN);
            localStorage.removeItem(DRAFT_ARTICLE_BN);
        }
    }));

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
                    value={content2 || ""}
                    config={config}
                    // onFocus = {newContent => handleEditorChange(newContent)}
                    onChange={newContent => handleEditorChange(newContent)}
                    // onChange={value => setContent(value)}
                    onBlur={newContent => setContent2(newContent)}
                // onFocus={newContent => setContent2(newContent)}
                // onClick={value => setContent2(value)}
                // onChange={newContent => {const newC = newContent;}}
                />

                {/* {isEditable ? "" : */}
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
                {/* } */}

            </div>
            {/* <button onClick={getHTMLContent}>Get HTML Content</button>

            <h2>Rendered Preview:</h2>
            <h3 className={styles.bn}>প্রিভিউ:  </h3>

            <div
                dangerouslySetInnerHTML={renderHTMLContent()}  // Render the HTML content
            /> */}
        </div>
    );
})

export default RichTextEditor;

