import { useEffect } from "react";
import useAuth from "./useAuth";
import axios, { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";

// const REFRESH_TOKEN_URL = '/api/v1/user/refresh_token'


const useAxiosPrivate = () => {
    // Calls useRefreshToken to get a function that can fetch a new access token when needed.
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();

// useEffect hook runs when the component mounts or when auth or refresh changes.
    useEffect(() => {
        // Modifies outgoing requests before they’re sent.
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                // Ensures all requests sent via axiosPrivate include the access token, 
                // which is typically required for authenticated API endpoints.
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        // Intercepts responses from the server
        // specifically catching errors to refresh tokens when needed.
        const responseIntercept = axiosPrivate.interceptors.response.use(
            // If the response is successful, just return it.
            response => response,
            async (error) => {
                // Retrieves the failed request’s configuration
                const prevRequest = error?.config;
                
                // Checks if the error is a 403 Forbidden 
                // If the request hasn’t been retried yet (!prevRequest?.sent).
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    // if (error?.response?.status === 403 && !prevRequest?._retry) {
                    
                    // Marks the request as sent (prevRequest.sent = true) 
                    // to prevent infinite retry loops
                    prevRequest.sent = true;
                    // prevRequest._retry = true;

                    // Calls refresh() to get a new access token
                    const newAccessToken = await refresh()

                    console.log("newAccessToken in useAxiosPrivate:: ", newAccessToken);
                    
                    // Updates the Authorization header with the new token.
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    
                    // Retries the original request using axiosPrivate
                    return axiosPrivate(prevRequest);
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axiosPrivate.interceptors.request.eject(requestIntercept);
            axiosPrivate.interceptors.response.eject(responseIntercept);
        }

    }, [auth, refresh])


    return axiosPrivate
}

export default useAxiosPrivate;