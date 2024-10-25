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
import { useMutation, useQueryClient } from 'react-query';

const postData = async (data, url, axiosInstance) => {
  const response = await axiosInstance.post(url,
    JSON.stringify(data),
    {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }
  );
  return response.data;
}

const ProfileWrite = () => {
  const CREATE_ARTICLE_API = '/api/v1/article/create_article'
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
      } else if (!value) {
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

  // const renderHTMLContent = () => {
  //     return { __html: content };  // Prepare the HTML content for rendering
  // };

  const axiosInst = axiosPrivate;
  const { mutate, isLoading, isError, isSuccess } = useMutation(
    (article_obj) => postData(article_obj, CREATE_ARTICLE_API, axiosInst), // Pass the data here
    {
      onMutate: () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
      },
      onSuccess: (data) => {
        setLoading(false);
        setSuccess(true);
        console.log("Success Server message:", data.message);
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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Get which button was clicked
    const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
    const buttonName = clickedButton.name; // The name of the button

    if (buttonName === 'reviewSubmit') {
      console.log("init finalArticleInfo::: ", articleInfo.coverImgCapEN
      );
      if (isAllReqFieldsPresent(articleInfo, ['tags', 'newTag'])) {
        console.log("finalArticleInfo::: ", articleInfo);
      } else {
        toast.error("Please fill in all required (*) Article Info correctly !", { duration: 7000 });
        return;
      }
      handleResetInfoAndRTE()
      console.log("Editor Content in ProfileWrite EN: ", editorContentEN);
      console.log("Editor Content in ProfileWrite BN: ", editorContentBN);
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
      mutate(article_obj);
      console.log("loading:: ", loading);
      console.log("success:: ", success);
      console.log("error:: ", error);
      
      

      // const parser = new DOMParser();
      // const doc = parser.parseFromString(editorContentEN, "text/html");

      // console.log("refined Content in ProfileWrite: ", doc.body.textContent);

      // const detectedLanguage = franc(doc.body.textContent, { only: ['eng', 'ben'] })
      // const words = countWords(doc.body.textContent)
      // console.log("no of words:: ", words);
      // console.log("detectedLanguage:: ", detectedLanguage);

    }
  };

  //  

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="profileWrite">
      <div><Toaster /></div>

      < TableOfContent sections={sections} />

      <h1 style={{ display: "flex", justifyContent: "center" }}>Start Writing.. </h1>

      <div id="instructions">
        <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Instructions</Divider>
      </div>

      <Collapse style={{ boxShadow: "0 2px 4px 0 rgba(0, 0, 0, 0.1), 0 3px 10px 0 rgba(0, 0, 0, 0.2)" }}
        accordion size="large" expandIconPosition='end'
        items={items}
      />

      <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Info</Divider>
      <form ref={formRef} className={styles.customForm} onSubmit={handleSubmit}>

        <div id="article-info">
          <ProfileWriteArticleInfo ref={articleInfoChildRef} finalArticleInfo={setArticleInfo} />
        </div>

        {/* Pass down the state and the setter to the editor */}
        <div id="body-en">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (English)</Divider>
          <RichTextEditor ref={rteChildRef1} language="en" onChange={setEditorContentEN} />
        </div>

        <div id="body-bn">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (Bangla)</Divider>
          <RichTextEditor ref={rteChildRef2} language="bn" onChange={setEditorContentBN} />
        </div>

        <hr />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={handleShow}
            name="confirmModal"
            className="btn btn-success" >
            Submit for Review
          </button>
          {/* <button type="submit" name="reviewSubmit" className="btn btn-success" >
            Submit for Review
          </button> */}
        </div>
        <Modal aria-labelledby="contained-modal-title-vcenter" centered
          show={show} onHide={handleClose}
          container={formRef.current}  // modal will be rendered inside <form><form/>
        // modal renders at the end of <body/> by defalut
        >

          {/* <Modal.Header closeButton> */}
          <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
            <Modal.Title>Confirm Submit ?</Modal.Title>
          </Modal.Header>

          <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
            Please save all drafts before submitting ! <br />
            If you confirm, all drafts will be cleared !
          </Modal.Body>

          <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
            <Button style={{ borderRadius: "20px" }} variant="outline-danger"
              onClick={handleClose}>
              <i className="fa-solid fa-xmark"></i>
            </Button>
            <Button type="submit"
              name="reviewSubmit"
              style={{ borderRadius: "20px" }} variant="outline-success"
            >
              <i className="fa-solid fa-check"></i>
            </Button>
          </Modal.Footer>
        </Modal>
      </form>
      <br /> <br />
    </div>
  );
}

export default ProfileWrite;