import RichTextEditor from "./rte/RichTextEditor";
import { useRef, useState, useEffect } from 'react';
import { franc } from 'franc-min'
import { Collapse, Divider } from "antd";
import toast, { Toaster } from 'react-hot-toast';
import styles from '../../css/ProfileWrite.module.css'
import ProfileWriteArticleInfo from "./ProfileWriteArticleInfo";

const ProfileWrite = () => {
  const [open, setOpen] = useState(false);

  // articleInfo fetches data from ProfileWriteArticleInfo.js component into this component
  const [articleInfo, setArticleInfo] = useState('')
  const [editorContentEN, setEditorContentEN] = useState("");

  const countWords = (text) => {
    // Split by spaces or newlines and filter out empty strings
    return text.trim().split(/\s+/).filter((word) => word).length;
  };

  const isAllReqFieldsPresent = (obj, excludedFieldList) => {
    for (const [key, value] of Object.entries(obj)){
      if (excludedFieldList.includes(key)){
        continue;
      } else if (!value){
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
      console.log("Editor Content in ProfileWrite: ", editorContentEN);

      const parser = new DOMParser();
      const doc = parser.parseFromString(editorContentEN, "text/html");

      console.log("refined Content in ProfileWrite: ", doc.body.textContent);

      const detectedLanguage = franc(doc.body.textContent, { only: ['eng', 'ben'] })
      const words = countWords(doc.body.textContent)
      console.log("no of words:: ", words);
      console.log("detectedLanguage:: ", detectedLanguage);
      
      if (isAllReqFieldsPresent(articleInfo, ['tags', 'newTag'])){
        console.log("finalArticleInfo::: ", articleInfo);
      }else {
        toast.error("Please fill all required (*) Article Info !", { duration: 7000 });
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
      children: <div dangerouslySetInnerHTML={{ __html: collapseText2 }} />,
    },
  ];

  return (
    <div className="profileWrite">
      <div><Toaster /></div>

      <h1 style={{ display: "flex", justifyContent: "center" }}>Start Writing.. </h1>
      <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Instructions</Divider>
      <Collapse
        accordion size="large" expandIconPosition='end'
        items={items}
      />
      <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Info</Divider>

      <form className={styles.customForm} onSubmit={handleSubmit}>

        <ProfileWriteArticleInfo finalArticleInfo={setArticleInfo} />

        <Divider style={{ borderColor: '#000000', fontSize: "25px" }} orientation="left">Article Body (English)</Divider>
        {/* Pass down the state and the setter to the editor */}
        <RichTextEditor onChange={setEditorContentEN} />


        {/* <Divider style={{ borderColor: '#000000' }} orientation="left">Article Body (Bangla)</Divider>
        <RichTextEditor onChange={setEditorContentEN} /> */}

        <button type="submit" name="reviewSubmit" className="btn btn-success" >Submit for Review</button>
      </form>

    </div>
  );
}

export default ProfileWrite;