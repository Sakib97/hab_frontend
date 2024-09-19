import axios from "../api/axios";
import useAuth from "./useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import useLogout from "./useLogout";


const REFRESH_TOKEN_URL = '/api/v1/user/refresh_token'

const useRefreshToken = () => {
    const { auth, setAuth } = useAuth();
    const logout = useLogout();

    const navigate = useNavigate()
    const location = useLocation()

    const refresh = async () => {
        try {
            // const refreshToken = auth?.refreshToken

            // the {} indicates that the request body is empty
            const response = await axios.post(REFRESH_TOKEN_URL, {}, {
                headers: {
                    // 'Authorization': `Bearer ${refreshToken}`,
                    // 'Authorization': `Bearer `,
                    'Content-Type': 'application/json' ,
                },
                withCredentials: true
            })

            setAuth(prev => {
                // console.log("in useRefreshToken Prev:: ", JSON.stringify(prev));
                // console.log("in useRefreshToken PrevResponse:: ", JSON.stringify(response));
                console.log("new acc tok in useRefreshToken:: ", response.data.new_access_token);
                return { ...prev, accessToken: response.data.new_access_token }
            })
            return response.data.new_access_token;
        }
        catch (error) {
            console.log("ref tok error:::", error);
             logout()
            // navigate('/auth/login', { state: { from: location }, replace: true });
        }


    }


    return refresh;
}

export default useRefreshToken;