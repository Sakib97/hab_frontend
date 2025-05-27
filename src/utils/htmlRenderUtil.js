// import useMemo from 'react';
import DOMPurify from 'dompurify';
import { useEffect, useMemo } from 'react';
import { getFormattedTime } from './dateUtils';

export const SafeHtmlRenderer = ({ html, className = 'bn3' }) => { // 'bn3' is in index.css
  // Sanitize the HTML first
  const cleanHtml = DOMPurify.sanitize(html);

  // Process the HTML to add classes
  const processedHtml = useMemo(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanHtml, 'text/html');

    // Select all elements that can contain text
    const textElements = doc.querySelectorAll(
      'p, strong, u, em, i, b, span, div, h1, h2, h3, h4, h5, h6, a'
    );

    textElements.forEach(el => {
      el.classList.add(className);
    });

    // Return the modified HTML string
    return doc.body.innerHTML;
  }, [cleanHtml, className]);

  // Render with dangerouslySetInnerHTML (safe because we sanitized it)
  return (
    <div style={{ fontSize: '20px' }} className={className}
      dangerouslySetInnerHTML={{ __html: processedHtml }} />
  );
}


// strTimeArray format: "['2025-04-28 23:36:39.697680', '2025-04-28 23:40:37.113449']"
// strCommentArray format: "['comment1', 'comment2']" 
// strArray format: "['2025-04-28 23:36:39.697680', '2025-04-28 23:40:37.113449']" or "new comment"
export const renderStrArray = (strArray, headingDisplayText, arrayContentType) => {
  // Check if the input is an array-like string
  let convertedArray;

  if (strArray && strArray.startsWith('[') && strArray.endsWith(']')) {
    // Replace single quotes with double quotes to make it valid JSON
    const cleanedStr = strArray.replace(/'/g, '"');
    // Parse the string into an array
    convertedArray = JSON.parse(cleanedStr);
  } else {
    // If it's not an array-like string, treat it as a single element
    convertedArray = [strArray];
  }

  // Map over the array and create a JSX element for each one
  const convertedArrayElements = convertedArray.map((element, index) => (
    <div key={index}>
      {/* ex: Sent for edit at (Round 1): 28 April 2025, 11:36 PM */}
      {arrayContentType === "text" ?
        <span> <u>{headingDisplayText}</u> </span> : 
        arrayContentType === "time" ?
        <span>{headingDisplayText}</span> :
        <span>{headingDisplayText}</span>
      } 
      
      {/* {convertedArray.length > 1 && `(Round ${index + 1}) :`} */}
      {arrayContentType === "text" ?
        <span> <u>(Round {index + 1}) :</u> </span> 
        : arrayContentType === "time" ?
        <span>(Round {index + 1}) :</span> 
        :
        <span>(Round {index + 1}) :</span>
      } 
      {arrayContentType === "time" && <b> {getFormattedTime(element)} </b>}
      {arrayContentType === "text" && <span><br /> {element} </span>}
    </div>
  ));

  // Return all the JSX elements wrapped in a parent container
  return <div>{convertedArrayElements}</div>;
};

