import styles from '../css/Home.module.css'

const Footer = () => {
    return ( 
        <div className={styles.footer}>
                <hr />
                <h3 style={{marginLeft: '10px'}}>History and Beyond</h3>
                <div className={styles.footerBars}>
                    <div className={styles.footerOptionsBar1}>
                        <h6 style={{ paddingBottom: '5px' }}>About Us</h6>
                        <h6 style={{ paddingBottom: '5px' }}>Join as Contributor </h6>
                        <h6 style={{ paddingBottom: '5px' }}>Terms and Conditions</h6>
                    </div>
                    <div className={styles.footerOptionsBar2}>
                        <h6 style={{ paddingBottom: '5px' }}>Conatct Us</h6>
                        <h6 style={{ paddingBottom: '5px' }}>Privacy Policy</h6>
                    </div>


                </div>
                <span style={{ paddingTop: '10px', display: 'flex', justifyContent: 'center' }}>
                    © 2025 History and Beyond. All Rights Reserved.
                </span>

            </div>
     );
}
 
export default Footer;