import { useEffect } from "react";
import useAuth from "./useAuth";
import axios, { axiosPrivate } from "../api/axios";
import useRefreshToken from "./useRefreshToken";

const REFRESH_TOKEN_URL = '/api/v1/user/refresh_token'


const useAxiosPrivate = () => {
    const refresh = useRefreshToken();
    const { auth, setAuth } = useAuth();


    useEffect(() => {
        const requestIntercept = axiosPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        );

        const responseIntercept = axiosPrivate.interceptors.response.use(
            response => response,
            async (error) => {
                const prevRequest = error?.config;
                if (error?.response?.status === 403 && !prevRequest?.sent) {
                    // if (error?.response?.status === 403 && !prevRequest?._retry) {
                    prevRequest.sent = true;
                    // prevRequest._retry = true;
                    const newAccessToken = await refresh()

                    console.log("newAccessToken in useAxiosPrivate:: ", newAccessToken);
                    prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
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