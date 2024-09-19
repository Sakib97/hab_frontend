// import styles from '../../css/Login.module.css'
import styles from '../../css/Register.module.css'

import { Link, useLocation, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from '../../api/axios';
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useAuth from '../../hooks/useAuth';
import useProfileContext from '../../hooks/useProfileContext';

const LOGIN_URL = '/api/v1/user/token'

const Login = () => {
    const { setAuth } = useAuth()
    const { profile, setProfile } = useProfileContext()

    // Let's say I am logged out. I have cliked the profile page. I will be redirected to the login page
    // Now when I log in, I should directly go to the Profile page, 
    // as I wanted to go to the Profile page originally. 
    // First capture the location from where I came to login page. (Redirect there after login !!)
    const navigate = useNavigate()
    const location = useLocation()
    const from = location.state?.from?.pathname || "/" // default redirect is home, hence "/"
    // console.log("From is :: ", from);

    const emailRef = useRef()

    const [email, setEmail] = useState('')
    const [pwd, setPwd] = useState('')

    const [showPassword, setShowPassword] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [loading, setLoading] = useState(false)


    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const login_request = { "email": email, "password": pwd }
            const response = await axios.post(LOGIN_URL,
                JSON.stringify(login_request),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )

            console.log(JSON.stringify(response?.data));

            const accessToken = response?.data?.access_token;
            const refreshToken = response?.data?.refresh_token;
            const roles = response?.data?.role;

            const user_email = response?.data?.email;
            const first_name = response?.data?.first_name;
            const last_name = response?.data?.last_name;
            const image_url = response?.data?.image_url;
            const is_active = response?.data?.is_active
            const is_verified = response?.data?.is_verified

            // setting value to global state 
            setAuth({ email, roles, is_active,is_verified, accessToken })

            setProfile(prev => { return { ...prev, user_email, first_name, last_name, image_url } })


            setLoading(false); setSuccess(true)

            setErrMsg(''); setEmail(''); setPwd('');
            navigate(from, { replace: true })

        } catch (err) {
            if (!err?.response) {
                setErrMsg('No Server Response');
                setSuccess(false);
                setLoading(false)
            } else if (err.response?.status === 400) {
                setErrMsg('Invalid Email or Password');
                setSuccess(false);
                setLoading(false)
            } else if (err.response?.status === 401) {
                setErrMsg('Unauthorized');
                setSuccess(false);
                setLoading(false)
            } else {
                setErrMsg('Login Failed');
                setSuccess(false);
                setLoading(false)
            }
        }
    }

    return (
        <>
            {success && <p style={{ color: "green", fontWeight: "bold" }}>Login Successful</p>}
            {errMsg && <p style={{ color: "red", fontWeight: "bold" }}>Error : {errMsg}</p>}
            <h2>Log In</h2>
            <form onSubmit={handleSubmit} className={styles.registrationForm}>
                <input type="email"
                    placeholder="Email"
                    ref={emailRef}
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                    autoComplete="email"
                    required />

                <div className={styles.inputWrapper}>
                    <input type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        onChange={(e) => { setPwd(e.target.value) }}
                        value={pwd}
                        required />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className={styles.iconToggle}
                        onClick={togglePasswordVisibility}
                        style={{ "--icon-color": "grey" }}
                    />
                </div>

                <button type="submit"
                    className="btn btn-success"
                    disabled={(email && pwd && !loading) ? false : true}>
                    {loading ? "Loading..." : "Log In"}
                </button>
            </form>
            
            <div style={{ display:"flex", justifyContent:"right"}}> <Link to="/auth/forget_pass_mail"> Forget Passowrd? </Link> </div>
            <br />
            <p>Don't have an account? <Link to="/auth/register">Sign Up</Link></p>
        </>
    );
}

export default Login;