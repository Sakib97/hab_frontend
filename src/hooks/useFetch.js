import { useEffect, useState } from "react";
import axios, { axiosPrivate } from "../api/axios";
import useAxiosPrivate from "./useAxiosPrivate";

const useFetch = (url, usePrivate = false) => {
    const axiosPrivate = useAxiosPrivate();
    const [data, setData] = useState({});  
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(()=>{
        let isMounted = true;  // To prevent setting state if the component is unmounted
        const controller = new AbortController();  // Create an AbortController to cancel requests if needed
        const fetchData = async ()=> {
            try {
                setIsLoading(true)
                const axiosInstance = usePrivate ? axiosPrivate : axios;
                const response = await axiosInstance.get(url, {
                    signal: controller.signal,  // Attach the abort signal to cancel if needed
                  });

                //   console.log("usefetch respose:: ", response.data);
                  

                  if (isMounted) {
                    setData(response.data);  // Store the data if the component is still mounted
                    setError(null);  // Clear any previous errors
                  }
                
            } catch (err) {
                if (isMounted) {
                    setError(err);  // Store the error if one occurs
                  }
                  
            } 
            finally {
                if (isMounted) {
                    setIsLoading(false);  // Set loading state to false when the request completes
                  }
            }
        }
        fetchData();

        return () => {
            isMounted = false;  // Clean up the isMounted flag to avoid memory leaks
            controller.abort();  // Cancel the request if the component is unmounted
          };
    }, [url, axiosPrivate, usePrivate])
// }, [])

    return  { data, error, isLoading };  
}
 
export default useFetch;