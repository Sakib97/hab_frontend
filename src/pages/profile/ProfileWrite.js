import RichTextEditor from "./rte/RichTextEditor";
import { useRef, useState, useEffect } from 'react';
import { franc } from 'franc-min'
import { Collapse, Divider } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import styles from '../../css/ProfileWrite.module.css'
import ProfileWriteArticleInfo from "./ProfileWriteArticleInfo";
import TableOfContent from "../../components/TableOfContent";


const ProfileWrite = () => {
  const [open, setOpen] = useState(false);

  // articleInfo fetches data from ProfileWriteArticleInfo.js component into this component
  const [articleInfo, setArticleInfo] = useState('')
  const [editorContentEN, setEditorContentEN] = useState("");
  const [editorContentBN, setEditorContentBN] = useState("");

  const countWords = (text) => {
    // Split by spaces or newlines and filter out empty strings
    return text.trim().split(/\s+/).filter((word) => word).length;
  };

  const isAllReqFieldsPresent = (obj, excludedFieldList) => {
    for (const [key, value] of Object.entries(obj)) {
      if (excludedFieldList.includes(key)) {
        continue;
      } else if (!value) {
        return false;
      }
    }
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page reload

    // Get which button was clicked
    const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
    const buttonName = clickedButton.name; // The name of the button

    if (buttonName === 'reviewSubmit') {
      console.log("Editor Content in ProfileWrite EN: ", editorContentEN);
      console.log("Editor Content in ProfileWrite BN: ", editorContentBN);

      const parser = new DOMParser();
      const doc = parser.parseFromString(editorContentEN, "text/html");

      console.log("refined Content in ProfileWrite: ", doc.body.textContent);

      const detectedLanguage = franc(doc.body.textContent, { only: ['eng', 'ben'] })
      const words = countWords(doc.body.textContent)
      console.log("no of words:: ", words);
      console.log("detectedLanguage:: ", detectedLanguage);

      if (isAllReqFieldsPresent(articleInfo, ['tags', 'newTag'])) {
        console.log("finalArticleInfo::: ", articleInfo);
      } else {
        toast.error("Please fill in all required (*) Article Info !", { duration: 7000 });
        return;
      }

    }
  };

  const collapseText1 = `<ul> 
  <li> Write the article both in <b>English</b> and <b>বাংলা</b> </li>
  <li> Include <b> Images </b> to make the article appealing </li>
  <ul>
    <li> Upload the image in a hosting site like: <a href="https://imgbb.com/"> https://imgbb.com/ </a> or <a href="https://imgur.com/"> https://imgur.com/ </a> etc. </li>
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
      <form className={styles.customForm} onSubmit={handleSubmit}>

        <div id="article-info">
          <ProfileWriteArticleInfo finalArticleInfo={setArticleInfo} />
        </div>


        {/* Pass down the state and the setter to the editor */}
        <div id="body-en">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (English)</Divider>
          <RichTextEditor language="en" onChange={setEditorContentEN} />
        </div>

        <div id="body-bn">
          <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (Bangla)</Divider>
          <RichTextEditor language="bn" onChange={setEditorContentBN} />
        </div>

        <hr />
        <div style={{display: "flex", justifyContent: "center"}}>
          <button type="submit" name="reviewSubmit" className="btn btn-success" >
            Submit for Review
          </button>
        </div>
      </form>
      <br /> <br />
    </div>
  );
}

export default ProfileWrite;