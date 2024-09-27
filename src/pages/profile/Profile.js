import useAuth from "../../hooks/useAuth";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import ProfileSidebar from "./ProfileSidebar";
import styles from '../../css/Profile.module.css'
import useProfileContext from "../../hooks/useProfileContext";


const Profile = () => {

    const PROFILE_URL = '/api/v1/user/profile'

    const [isSidebarExpanded, setSidebarExpanded] = useState(false);

    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfileContext()
    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate()
    const location = useLocation()

    // const screenWidth = window.innerWidth;

    useEffect(() => {
        // console.log("profile:: ", profile);
        const controller = new AbortController();
        const getProfile = async () => {
            try {
                const response = await axiosPrivate.get(PROFILE_URL, {
                    signal: controller.signal
                });
                console.log("INN Profile response.data:: ", response.data);

                const user_email = response?.data?.user_email;
                const first_name = response?.data?.first_name;
                const last_name = response?.data?.last_name;
                const image_url = response?.data?.image_url;
                const delete_image_url = response?.data?.delete_image_url;
                const is_active = response?.data?.is_active
                const is_verified = response?.data?.is_verified


                setProfile(prev => { return { ...prev, user_email, first_name, last_name, image_url, delete_image_url, is_active, is_verified } })

            } catch (error) {
                // if (error.message === 'canceled') {
                if (error) {
                    console.log('Request canceled', error);
                }
                else {
                    console.error('Error fetching user data:', error);
                    navigate('/unauthorized', { state: { from: location }, replace: true });
                }
            }
        }

        getProfile()
        return () => {
            controller.abort();
        }

    }, [])



    return (
        <div className="profile" >

            <div className={styles.profileContainer}>
                <div className={styles.sidebarColumn}>
                    <ProfileSidebar  setSidebarExpanded={setSidebarExpanded} />
                </div>
                {/* <div className={styles.contentColumn}> */}
                <div className={`${styles.contentColumn} ${isSidebarExpanded ? styles.expandedContent : ''}`}>
                    <Outlet />
                </div>
            </div>


        </div>
    );
}

export default Profile;