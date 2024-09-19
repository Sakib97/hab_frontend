import { createContext, useState, useEffect } from "react";

const ProfileContext = createContext({})

export const ProfileProvider = ({children}) => {
    const [profile, setProfile] = useState( ()=> {
        const storedProfile = localStorage.getItem('profile');
        return storedProfile ? JSON.parse(storedProfile) : {}
    })

    useEffect(() => {
        // Load user from localStorage
        const savedProfile = JSON.parse(localStorage.getItem('profile'));
        if (savedProfile) {
            setProfile(savedProfile);
        }
    }, []);

    useEffect(() => {
        // Save user to localStorage
        if (profile) {
            localStorage.setItem('profile', JSON.stringify(profile));
        } else {
            localStorage.removeItem('profile');
        }
    }, [profile]);

    return ( 
        <ProfileContext.Provider value={{profile, setProfile}}>
            {children}
        </ProfileContext.Provider>
     );
}
 
export default ProfileContext;