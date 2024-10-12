import styles from '../css/TableOfContent.module.css'; 
import { useRef, useState, useEffect } from 'react';

const TableOfContent = ({ sections }) => {
    const [activeSection, setActiveSection] = useState(null);

    // Track which section is in view using IntersectionObserver
  useEffect(() => {
    const options = {
      root: null, // viewport
      threshold: 0.9, // 50% of the section should be visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    // Observe each section by ID
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => {
      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element) observer.unobserve(element);
      });
    };
  }, [sections]);

  return (
    <div className={styles.treeViewContainer}>
        Contents
        <hr />
      <ul>
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={activeSection === section.id ? styles.active : ''}
            >
              {section.name}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TableOfContent;