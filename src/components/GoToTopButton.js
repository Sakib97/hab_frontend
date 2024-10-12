import { useState, useEffect } from 'react';
import ArrowCircleUpTwoToneIcon from '@mui/icons-material/ArrowCircleUpTwoTone';
import ExpandLessTwoToneIcon from '@mui/icons-material/ExpandLessTwoTone';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
const GoToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    // Show the button when the user scrolls down 300px
    const toggleVisibility = () => {
        // if (window.pageYOffset > 300) {
            if (window.scrollY > 70) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Scroll to the top smoothly
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Add an event listener for scrolling
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    return (
        <div>
            {isVisible && (
                <button onClick={scrollToTop} style={styles.button}>
                    {/* <FaArrowUp size={20} />  */}
                    <ArrowCircleUpIcon/> 
                    {/* <i className="fa-solid fa-chevron-up"></i> */}
                </button>
            )}
        </div>
    );
}

// Styling for the button
const styles = {
    button: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        // backgroundColor: '#333',
        backgroundColor: 'rgba(1, 1, 1, 0.6)',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        padding: '10px',
        cursor: 'pointer',
        zIndex: 1000,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
    },
};

export default GoToTopButton;