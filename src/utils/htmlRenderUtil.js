// import useMemo from 'react';
import DOMPurify from 'dompurify';
import { useEffect, useMemo } from 'react';

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
