import axios from "axios"
// const BASE_URL = 'http://127.0.0.1:8000'
const BASE_URL = 'https://hab-backend.onrender.com'


// Creates a basic Axios instance with just a base URL
// Used for public API endpoints that don't require authentication
export default axios.create({
    baseURL: BASE_URL
})


/* 
Creates a more configured Axios instance for authenticated requests
headers: Sets default content type to JSON
withCredentials: true: Enables sending cookies or authentication headers with requests
Typically used for protected API endpoints that require authentication
*/
export const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
})


// import axios from './axios';
// Default Export: Often used for the primary object or 
// function a module provides. 
// It’s convenient when you expect users to import one main thing 
// (e.g., a general-purpose Axios instance).



// import { axiosPrivate } from './axios';
// Named Export: Useful for exporting additional utilities or 
// variations from the same module 
// (e.g., a specialized Axios instance for private routes).
