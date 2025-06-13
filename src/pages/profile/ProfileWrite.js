import RichTextEditor from "./rte/RichTextEditor";
import { useRef, useState, useEffect } from 'react';
import { franc } from 'franc-min'
import { Collapse, Divider } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import styles from '../../css/ProfileWrite.module.css'
import ProfileWriteArticleInfo from "./ProfileWriteArticleInfo";
import TableOfContent from "../../components/TableOfContent";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import DOMPurify from 'dompurify';
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useMutation, useQuery, useQueryClient } from 'react-query';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { renderStrArray } from "../../utils/htmlRenderUtil";
import { fetchData } from "../../utils/getDataUtil";
import { cleanedTags } from "../../utils/slugAndStringUtil";
import { postData } from "../../utils/postDataUtils";


const ProfileWrite = () => {

  /// When sent_for_edit from my_articles -------------
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const articleIDFromSearch = parseInt(searchParams.get('a_id'));
  const editFromSearch = searchParams.get('edit') === "true" ? true : false;
  const { editFromState, articleIDFromState, decisionCommentFromState,
    editorEmail } = location.state || {};

  // console.log(editFromState, articleIDFromState, decisionCommentFromState, editorEmail);

  const validStateAndSearchParams =
    articleIDFromSearch != null &&
    editFromSearch != null &&
    !isNaN(articleIDFromSearch) &&
    !isNaN(editFromSearch) &&
    articleIDFromSearch === articleIDFromState &&
    editFromSearch === editFromState;

  const invalidStateAndSearchParams =
    articleIDFromSearch != null &&
    editFromSearch != null &&
    !isNaN(articleIDFromSearch) &&
    !isNaN(editFromSearch) &&
    (articleIDFromSearch !== articleIDFromState || editFromSearch !== editFromState);

  /// When sent_for_edit from my_articles -------------

  // console.log("validStateAndSearchParams:", validStateAndSearchParams);
  // console.log("invalidStateAndSearchParams:", invalidStateAndSearchParams);

  const CREATE_ARTICLE_API = '/api/v1/article/create_article'
  const GET_SENT_FOR_EDIT_ARTICLE_BY_ID_API = `/api/v1/article/sent_for_edit_article/${articleIDFromSearch}`
  const EDIT_ARTICLE_API = `/api/v1/article/edit_article/${articleIDFromSearch}`
  const [open, setOpen] = useState(false);

  // articleInfo fetches data from ProfileWriteArticleInfo.js component into this component
  const [articleInfo, setArticleInfo] = useState('')
  const [editorContentEN, setEditorContentEN] = useState("");
  const [editorContentBN, setEditorContentBN] = useState("");

  const axiosPrivate = useAxiosPrivate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [editorMail, setEditorMail] = useState('');
  const [editorName, setEditorName] = useState('');

  // To ensure GET_SENT_FOR_EDIT_ARTICLE_BY_ID_API 
  // is called on every mount, we remove any cache--------
  useEffect(() => {
    queryClient.removeQueries(['sentForEditArticleData']);
  }, []);
  // -----------------------------------------------

  // Add a ref to the form
  const formRef = useRef(null);
  // Create a ref to access the child (info, RTE)
  const articleInfoChildRef = useRef(null);
  const rteChildRef1 = useRef(null);
  const rteChildRef2 = useRef(null);

  const countWords = (text) => {
    // Split by spaces or newlines and filter out empty strings
    return text.trim().split(/\s+/).filter((word) => word).length;
  };

  const isAllReqFieldsPresent = (obj, excludedFieldList) => {
    if (!obj) {
      return false;
    }
    for (const [key, value] of Object.entries(obj)) {
      if (excludedFieldList.includes(key)) {
        continue;
      }
      else if (!value) {
        // else if (typeof value === "string" && value.trim() === "") {
        return false;
      }
    }
    return true;
    // } else return false;

  }

  // Function to reset both children
  const handleResetInfoAndRTE = () => {
    if (articleInfoChildRef.current) {
      articleInfoChildRef.current.articleInfoResetFields()
    }
    if (rteChildRef1.current) {
      rteChildRef1.current.rteResetFields(); // Reset first child
    }
    if (rteChildRef2.current) {
      rteChildRef2.current.rteResetFields(); // Reset second child
    }
  };

  const getSanitizedHTML = (content) => {
    const sanitizedContent = DOMPurify.sanitize(content);
    // const jsonData = {
    //     content: sanitizedContent,
    // };
    // const jsonString = JSON.stringify(jsonData);

    // console.log("Saved JSON:", jsonString);
    // console.log("sanitizedContent htmlContent::", sanitizedContent);  
    // console.log("htmlContent::", content);  
    return sanitizedContent;
  };

  const axiosInst = axiosPrivate;
  const { mutate, isLoading, isError, isSuccess, data } = useMutation(
    async (article_obj) =>
      postData({
        data: article_obj,
        url: CREATE_ARTICLE_API,
        axiosInstance: axiosInst
      }), // Pass the data here
    {
      onMutate: () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
      },
      onSuccess: () => {
        setLoading(false);
        setSuccess(true);
        // Invalidate any queries you need to refetch after posting, if necessary
        queryClient.invalidateQueries('createArticle');
      },
      onError: (error) => {
        setLoading(false);
        setError(error);
        setSuccess(false);
        console.error("Error posting data: ", error);
      },
    }
  );

  // get this sent for edit article by article ID----------------
  const { data: articleData, error: articleError,
    isLoading: articleLoading } = useQuery(
      ['sentForEditArticleData', GET_SENT_FOR_EDIT_ARTICLE_BY_ID_API],
      () => fetchData(GET_SENT_FOR_EDIT_ARTICLE_BY_ID_API, axiosInst),
      {
        enabled: validStateAndSearchParams, // call API only when there are valid SearchParams
        keepPreviousData: false, // Preserve previous data while fetching new
        // staleTime: 600,  // Example option: Cache data for 6 seconds
        refetchOnWindowFocus: false,  // Disable refetch on window focus
        refetchOnMount: "always",
      }
    );

  // submit data for sent for edit ------------------------
  const editArticleMutation = useMutation({
    mutationFn: postData,
    onSuccess: (response) => {
      setEditorMail(editorEmail) // editorEmail coming from state
      queryClient.invalidateQueries('editArticleData');
    }
  });


  // -----------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Get which button was clicked
    const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
    const buttonName = clickedButton.name; // The name of the button

    if (buttonName === 'reviewSubmit') {
      // console.log("init finalArticleInfo::: ", articleInfo.coverImgCapEN);
      if (isAllReqFieldsPresent(articleInfo, ['tags', 'newTag'])) {
      } else {
        // console.log("finalArticleInfo::: ", articleInfo);

        toast.error("Please fill in all required (*) Article Info correctly !", { duration: 7000 });
        return;
      }
      // handleResetInfoAndRTE()
      // console.log("Editor Content in ProfileWrite EN: ", editorContentEN);
      // console.log("Editor Content in ProfileWrite BN: ", editorContentBN);
      const sanitizedContentEN = getSanitizedHTML(editorContentEN)
      const sanitizedContentBN = getSanitizedHTML(editorContentBN)
      const article_obj = {
        "category_id": articleInfo.categoryID,
        "subcategory_id": articleInfo.subcategoryID,
        "title_en": articleInfo.titleEN,
        "title_bn": articleInfo.titleBN,
        "subtitle_en": articleInfo.subtitleEN,
        "subtitle_bn": articleInfo.subtitleBN,

        "content_en": sanitizedContentEN,
        "content_bn": sanitizedContentBN,
        "cover_img_link": articleInfo.coverImgLink,
        "cover_img_cap_en": articleInfo.coverImgCapEN,
        "cover_img_cap_bn": articleInfo.coverImgCapBN,
        "tags": JSON.stringify(articleInfo.tags),
        "new_tag": JSON.stringify(articleInfo.newTag)
      }

      // console.log("article_obj:: ", article_obj);

      if (!validStateAndSearchParams) {
        mutate(article_obj, {
          onSuccess: (data) => {
            // console.log("API Response:", data.data.msg); 
            if (data?.data) {
              const message = data.data.msg;
              // const email = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
              // setEditorMail(email[0])

              // Step 1: Get the part after the colon
              const fullPart = message.split(": ")[1]; // "As Sakib_ikdyklfnerkjthkr"
              // Step 2: Split from the last underscore
              const lastUnderscoreIndex = fullPart.lastIndexOf("_");
              const name = fullPart.substring(0, lastUnderscoreIndex); // "As Sakib"
              const userSlug = fullPart.substring(lastUnderscoreIndex + 1); // "ikdyklfnerkjthkr"

              setEditorName(name); // Set the editor's name
              setEditorMail(userSlug);

              // toast.success(`Article submitted: ${data.data.msg}`, { duration: 5000 });
            } else {
              toast.success("Article submitted successfully!", { duration: 5000 });
            }
          },
          onError: (error) => {
            console.error("Error in submission:", error);
            toast.error("Failed to submit article. Please try again.", { duration: 5000 });
          }
        });
      }
      if (validStateAndSearchParams) {
        const edited_article_obj = {
          "editor_email": editorEmail,
          "category_name": articleInfo.category,
          "subcategory_name": articleInfo.subCategory,
          "title_en": articleInfo.titleEN,
          "title_bn": articleInfo.titleBN,
          "subtitle_en": articleInfo.subtitleEN,
          "subtitle_bn": articleInfo.subtitleBN,

          "content_en": sanitizedContentEN,
          "content_bn": sanitizedContentBN,
          "cover_img_link": articleInfo.coverImgLink,
          "cover_img_cap_en": articleInfo.coverImgCapEN,
          "cover_img_cap_bn": articleInfo.coverImgCapBN,
          "tags": JSON.stringify(articleInfo.tags),
          "new_tag": JSON.stringify(articleInfo.newTag)
        }
        // console.log("edited_article_obj:: ", edited_article_obj);
        editArticleMutation.mutate({
          data: edited_article_obj,
          url: EDIT_ARTICLE_API,
          axiosInstance: axiosInst
        })


      }


      // const parser = new DOMParser();
      // const doc = parser.parseFromString(editorContentEN, "text/html");

      // console.log("refined Content in ProfileWrite: ", doc.body.textContent);

      // const detectedLanguage = franc(doc.body.textContent, { only: ['eng', 'ben'] })
      // const words = countWords(doc.body.textContent)
      // console.log("no of words:: ", words);
      // console.log("detectedLanguage:: ", detectedLanguage);

    }
  };



  const collapseText1 = `<ul> 
  <li> Write the article both in <b>English</b> and <b>বাংলা</b> </li>
  <li> Include <b> Images </b> to make the article appealing </li>
  <ul>
    <li> Upload the image in a hosting site like: <a href="https://imgbb.com/"> https://imgbb.com/ </a> </li>
    <li> Copy the <b> image URL </b> and paste in <b>"Image (<i class="fa-regular fa-image"></i>)" </b> option </li>
    <li> Finally, resize and palce the image in the Editor as necessary</li>
  </ul>
  <li> Fill up all the fields before submission </li>
  <li> Click the Preview button (<i class="fa-solid fa-eye"></i>) to see the final render </li>
  <li> Maximum three (03) tags can be given </li>
  <li> <b><u><span style="color:red;">Save All Drafts before final Submission</b></u> </li>
  
  </u>`

  const collapseText2 = `<ul> 
  <li> Please make sure the article falls in-line with <b>Islamic</b> principles </li>
  <li> Citation for any factual claim is a must </li>
  <li> Give <b>Captions</b> to all Images </li>
  <li> Don't use any slangs </li>
  </u>`

  const items = [
    {
      key: '1',
      label: 'Technical Instructions',
      children: <div dangerouslySetInnerHTML={{ __html: collapseText1 }} />,
    },
    {
      key: '2',
      label: 'Literary Instructions',
      children: <div id="litIns" dangerouslySetInnerHTML={{ __html: collapseText2 }} />,
    },
  ];

  const sections = [
    { id: 'instructions', name: 'Instructions' },
    { id: 'article-info', name: 'Article Information' },
    { id: 'body-en', name: 'Article Body (English)' },
    { id: 'body-bn', name: 'Article Body (Bangla)' },
  ];

  const [show, setShow] = useState(false);

  const handleClose = () => {
    setShow(false);
  }
  const handleShow = () => {
    setEditorMail('')
    setShow(true);
  }

  // To send Invalid URL message if anyone manipulates with URL manually
  // as edit is very sensitive URL (URL coming for sent_for_edit)

  // if (articleIDFromSearch && editFromSearch) {
  //   if (articleIDFromSearch !== articleIDFromState || editFromSearch !== editFromState)
  //     return <h3 style={{ padding: "30px", color: "red", display: 'flex', justifyContent: 'center' }}>
  //       <b>Invalid URL ! Please try again !</b></h3>;

  //   handleResetInfoAndRTE();

  // }

  // Sent for Edit Functionalities --------------------------
  useEffect(() => {
    if (validStateAndSearchParams) {
      // console.log("handleResetInfoAndRTE");
      handleResetInfoAndRTE();
    }
  }, [validStateAndSearchParams]);

  if (invalidStateAndSearchParams) {
    return <h3 style={{ padding: "30px", color: "red", display: 'flex', justifyContent: 'center' }}>
      <b>Invalid URL ! Please try again !</b></h3>;
  }

  if (validStateAndSearchParams) {
    // handleResetInfoAndRTE();
    if (articleLoading) {
      handleResetInfoAndRTE();
      // console.log("Loasssss");
      return <h3 style={{ padding: "30px", display: 'flex', justifyContent: 'center' }}>
        <b>Loading...</b></h3>;
    }
    if (articleError) {
      return <h3 style={{ padding: "30px", color: "red", display: 'flex', justifyContent: 'center' }}>
        <b>Server Error ! Please try again !</b></h3>;
    }
    // console.log("articleData", articleData);

  }
  // Sent for Edit Functionalities --------------------------


  return (
    <div className="profileWrite">
      <div><Toaster /></div>

      {!validStateAndSearchParams && < TableOfContent sections={sections} />}

      <h1 style={{ display: "flex", justifyContent: "center" }}>

        {validStateAndSearchParams ? <span> Start Editing...</span> :
          <span> Start Writing...</span>}
      </h1>

      <div id="instructions">
        <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Instructions</Divider>
      </div>

      <Collapse style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.2)" }}
        accordion size="large" expandIconPosition='end'
        items={items}
      />

      <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Info</Divider>

      {validStateAndSearchParams && decisionCommentFromState
        && <div style={{
          display: 'flex', justifyContent: 'center', whiteSpace: 'pre-wrap',
          padding: '10px', fontSize: "20px", color: '#000000', fontWeight: 'bold',
          border: 'solid 3px', borderRadius: '20px', margin: '-5px 20px 20px 20px'
        }}>
          {renderStrArray(decisionCommentFromState, "Editor's Review to Address - ", "text")}
        </div>
      }

      <form ref={formRef} className={styles.customForm} onSubmit={handleSubmit}>

        {validStateAndSearchParams && <div id="article-info">
          <ProfileWriteArticleInfo ref={articleInfoChildRef}
            finalArticleInfo={setArticleInfo}
            isEditable={validStateAndSearchParams}
            editableArticle={articleData}
          />
        </div>}

        {!validStateAndSearchParams && <div id="article-info">
          <ProfileWriteArticleInfo ref={articleInfoChildRef}
            finalArticleInfo={setArticleInfo}
          />
        </div>}

        {/* Pass down the state and the setter to the editor */}
        <div id="body-en">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (English)</Divider>
          {validStateAndSearchParams && <RichTextEditor ref={rteChildRef1} language="en"
            onChange={setEditorContentEN}
            isEditable={validStateAndSearchParams}
            editableArticle={articleData}
          />}
          {!validStateAndSearchParams && <RichTextEditor ref={rteChildRef1} language="en"
            onChange={setEditorContentEN}
          />}
        </div>

        <div id="body-bn">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (Bangla)</Divider>
          {validStateAndSearchParams && <RichTextEditor ref={rteChildRef2} language="bn"
            onChange={setEditorContentBN}
            isEditable={validStateAndSearchParams}
            editableArticle={articleData} />}

          {!validStateAndSearchParams && <RichTextEditor ref={rteChildRef1} language="bn"
            onChange={setEditorContentBN}
          />}
        </div>

        <hr />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleShow}
            name="confirmModal"
            className="btn btn-success" >
            Submit {validStateAndSearchParams && "Edited Article"} for Review
          </button>
        </div>
        <Modal aria-labelledby="contained-modal-title-vcenter" centered
          show={show} onHide={handleClose}
          container={formRef.current}  // modal will be rendered inside <form><form/>
        // modal renders at the end of <body/> by defalut
        >

          {/* <Modal.Header closeButton> */}
          <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
            <Modal.Title>
              {editorMail ? <span style={{ fontWeight: "bold", color: "green" }}> Success ! </span> :
                <span> Confirm {validStateAndSearchParams ? "Resubmit" : "Submit"} ? </span>}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
            {!editorMail && (
              <span>
                <span style={{ fontWeight: 'bold', fontSize: "20px" }}>Please save all drafts before submitting !</span> <br />
                {validStateAndSearchParams ? (
                  <>
                    Edited article will be submitted for review to
                    <b> {articleData.editor_firstname} {articleData.editor_lastname}</b> ({articleData.editor_email})
                  </>
                ) : (
                  <>If you confirm, all drafts will be cleared ! <br /></>
                )}
              </span>
            )}

            {editorMail && <div style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}>
              <CheckCircleTwoToneIcon style={{ color: "green", fontSize: "50px" }} />
              <span style={{ color: "green", fontWeight: "bold" }} >Article Submitted for Review Successfully !</span>
              <div style={{ display: 'flex' }}>
                Editor: &nbsp;
                <Link to={`/user/${editorMail}`} >
                  <span style={{ color: "#1039a1" }}>
                    <b>{editorName}</b>
                  </span>
                </Link>
              </div>
            </div>}
          </Modal.Body>

          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>

            <Button style={{ borderRadius: "20px" }} variant="outline-danger"
              onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </Button>

            {(!isLoading && !editorMail && !editArticleMutation.isLoading) && <Button type="submit"
              name="reviewSubmit"
              style={{ borderRadius: "20px" }} variant="outline-success"
            >
              <i className="fa-solid fa-check"></i>
            </Button>}
            {(isLoading || editArticleMutation.isLoading) && <p>&nbsp; Loading...</p>}
            {editArticleMutation.isError &&
              <span style={{ fontWeight: 'bold', color: 'red' }}>
                Error Submitting Article ! Please try apain
              </span>}

          </Modal.Footer>
        </Modal>
      </form>
      <br /> <br />
    </div>
  );
}

export default ProfileWrite;