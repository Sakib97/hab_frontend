import { useState } from 'react';
import styles from '../css/LanguageToggle.module.css'

const LanguageToggle = ({ onToggle }) => {
    const [isEnglish, setIsEnglish] = useState(true);

    const toggleLanguage = () => {
        const newIsEnglish = !isEnglish;
        setIsEnglish(newIsEnglish);
        onToggle(newIsEnglish);  // Notify the parent component
    };
    return (
        <div className={styles.toggleContainer} onClick={toggleLanguage}>
            <div className={`${styles.slider} ${isEnglish ? styles.english : styles.bengali}`}>
                <span className={styles.sliderText}>{isEnglish ? 'EN' : 'BN'}</span>
            </div>
            <span className={`${styles.languageLabel} ${isEnglish ? styles.showBN : styles.hide}`}>
                BN
            </span>
            <span className={`${styles.languageLabel} ${isEnglish ? styles.hide : styles.showEN}`}>
                EN
            </span>
        </div>
    );
}

export default LanguageToggle;