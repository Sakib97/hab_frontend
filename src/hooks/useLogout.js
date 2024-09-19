import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../api/axios';
import useAuth from './useAuth';
import useProfileContext from './useProfileContext';


const useLogout = () => {
    const LOGOUT_URL = '/api/v1/user/logout'
    const { setAuth } = useAuth();
    const {setProfile} = useProfileContext()
    const navigate = useNavigate();
    const location = useLocation();

    const logout = async () => {
        try {
            await axios.post(LOGOUT_URL, {}, { withCredentials: true });
            setAuth({});
            setProfile({});
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/auth/login', { state: { from: location }, replace: true });
        } catch (err) {
            console.error('Logout error:', err);

            setAuth({});
            setProfile({});
            localStorage.removeItem('auth');
            localStorage.removeItem('profile');
            navigate('/auth/login', { state: { from: location }, replace: true });
        }
    };
    
    return logout
}
 
export default useLogout;