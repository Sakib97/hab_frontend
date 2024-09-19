import { Outlet } from 'react-router-dom';
import styles from '../../css/Register.module.css'

const AuthLayout = () => {
    return ( 
        <div className={styles.register}>
            <div className={`${styles.pageWrapper} container`}>
                <div className={styles.registrationContainer}>

                    <div className={styles.leftSection}>
                        <div className={styles.text}>
                            <h1>Welcome to Our Platform</h1>
                            <h3>Become an editor</h3>
                            <h5>Share your knowledge with us</h5>
                            <p>Read our <a href="/">terms and conditions</a> to become an editor</p>
                        </div>
                    </div>

                    <div className={styles.rightSection}>
                        <Outlet />
                    </div>

                </div>
                
            </div>
        </div>
     );
}
 
export default AuthLayout;