import styles from '../../../css/RTE.module.css'
import { useRef, useState, useEffect, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import toast, { Toaster } from 'react-hot-toast';
import DOMPurify from 'dompurify';

const RichTextEditor = ({ onChange }) => {
    const DRAFT_ARTICLE_EN = "draftArticleEn";
    const DRAFT_ARTICLE_BN = "draftArticleBn";

    // const editor = useRef(null);
    const [content, setContent] = useState('');
    const [content2, setContent2] = useState('');

    // Load content from localStorage when the component mounts
    useEffect(() => {
        const savedContent = localStorage.getItem(DRAFT_ARTICLE_EN);
        if (savedContent) {
            setContent(savedContent);
            setContent2(savedContent);
            onChange(savedContent); 
        }
    }, []);

    // IMP::: https://xdsoft.net/jodit/play.html
    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        autofocus: true,
        placeholder: 'Start Article Body...',
        minHeight: 300,
        maxHeight: 600,
        // minWidth: 400,
        maxWidth: 800,
        toolbarStickyOffset: 50,
        removeButtons: ['speechRecognize', 'about', 'copyformat', 'classSpan', 'ai-commands', 'ai-assistant'],
        events: {
            error: (error) => {
                // Handle the error
                console.error("Jodit Editor Error:", error);
                toast.error("An error occurred in the editor.", { duration: 2000 });
            },
        },
        statusbar: false,
        toolbarAdaptive: false,

    }),
        [],
    );

    const handleEditorChange = (newContent) => {
        setContent(newContent);  // Update the state with the new content
        onChange(newContent); // Call the parent's onChange to lift the state up
        
    };

    const saveDraftEN = () => {
        setContent2(content);
        localStorage.setItem(DRAFT_ARTICLE_EN, content)
        toast.success("Draft Saved", { duration: 2000 });
    }

    // Clear the draft from localStorage
    const clearDraftEN = () => {
        setContent2('');
        localStorage.removeItem(DRAFT_ARTICLE_EN);
        setContent('');
        
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
            <div className={styles.editor}>
                <div><Toaster /></div>
                
                <JoditEditor
                    // ref={editor}
                    value={content2}
                    config={config}
                    // onFocus = {newContent => handleEditorChange(newContent)}
                    // onBlur={newContent => handleEditorChange(newContent)} 
                    onChange={newContent => handleEditorChange(newContent)}
                    // onChange={newContent => {const newC = newContent;}}
                />
                <div style={{marginTop: "10px", display:"flex", justifyContent:"center"}}>
                    <button  type="submit" name="saveDraft" onClick={saveDraftEN} className='btn btn-success'> Save Draft </button> &nbsp;&nbsp;
                    <button  type="submit" name="clearDraft" onClick={clearDraftEN} className='btn btn-danger'> Clear Draft </button>
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

