// receives data, url and axiosInstance as an object, hence {}
export const postData = async ({data, url, axiosInstance}) => {
    
    const response = await axiosInstance.post(url,
        JSON.stringify(data),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
    return response; 

}