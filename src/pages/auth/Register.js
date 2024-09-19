import { useRef, useState, useEffect } from "react";
import { faCheck, faXmark, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from '../../css/Register.module.css'
import { Link } from "react-router-dom";
import axios from "../../api/axios"

// acceptable formats of i/p fields
const NAME_REGEX = /^[A-z][A-z0-9-_]{1,9}$/;

// xmpl pass: #HelloWorld1
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const REGISTER_URL = '/api/v1/user/create';

const Register = () => {
    const fnameRef = useRef();

    const [fname, setFname] = useState('');
    const [isValidFname, setIsValidFname] = useState(false);
    const [fnameFocus, setFnameFocus] = useState(false);

    const [lname, setLname] = useState('');
    const [isValidLname, setIsValidLname] = useState(false);
    const [lnameFocus, setLnameFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPWD] = useState('');
    const [isValidPWD, setIsValidPWD] = useState(false);
    const [pwdFocus, setPWDFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [pwdMatch, setPWDMatch] = useState('');
    const [isValidPWDMatch, setIsValidPWDMatch] = useState(false);
    const [pwdMatchFocus, setPWDMatchFocus] = useState(false);
    const [showPasswordMatch, setShowPasswordMatch] = useState(false);

    // Loading
    const [loading, setLoading] = useState(false)

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        fnameRef.current.focus();
    }, [])

    useEffect(() => {
        setIsValidFname(NAME_REGEX.test(fname))
    }, [fname])

    useEffect(() => {
        setIsValidLname(NAME_REGEX.test(lname))
    }, [lname])

    useEffect(() => {
        setIsValidEmail(EMAIL_REGEX.test(email))
    }, [email])

    useEffect(() => {
        setIsValidPWD(PWD_REGEX.test(pwd))
        setIsValidPWDMatch(pwd === pwdMatch)
    }, [pwd, pwdMatch])

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const togglePasswordMatchVisibility = () => {
        setShowPasswordMatch(prevState => !prevState);
    };

    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();

        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(fname)
        const v2 = NAME_REGEX.test(lname)
        const v3 = EMAIL_REGEX.test(email)
        const v4 = PWD_REGEX.test(pwd)
        if (!v1 || !v2 || !v3 || !v4) {
            setErrMsg("Invalid Entry");
            setLoading(false)
            return;
        }
        try {
            const user_obj = {
                "first_name": fname,
                "last_name": lname, "email": email, "password": pwd
            }
            
            const response = await axios.post(REGISTER_URL,
                JSON.stringify(user_obj),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            )
            // console.log("Entry Successful !!");
            // console.log(response?.data);
            // console.log(JSON.stringify(response))
            setLoading(false)
            setSuccess(true); setErrMsg('')
            setFname(''); setLname(''); setEmail('');
            setPWD(''); setPWDMatch('');
        } catch (err) {
            if (!err?.response) {
                setSuccess(false);
                setLoading(false)
                setErrMsg('No Server Response');
            } else if (err.response?.status === 409) {
                setSuccess(false);
                setLoading(false)
                setErrMsg('Email is already registered !');
            } else {
                setSuccess(false);
                setLoading(false)
                setErrMsg('Registration Failed')
            }
        }

    }

    return (
        <>
            {success && <p style={{color: "green", fontWeight: "bold"}}>Registration Successful ! Please <Link to="/auth/login">Log in</Link></p>}
            {errMsg && <p style={{color: "red", fontWeight: "bold"}}>Error : {errMsg}</p>}

            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit} className={styles.registrationForm} >
                <div className={styles.nameFields}>
                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="First Name *"
                            autoComplete="new-password"
                            ref={fnameRef}
                            onChange={(e) => { setFname(e.target.value) }}
                            value={fname}
                            onFocus={() => setFnameFocus(true)}
                            onBlur={() => setFnameFocus(false)}
                            required />

                        {isValidFname && <FontAwesomeIcon icon={faCheck} className={styles.icon} style={{ "--icon-color": "green", "--icon-right": "10px" }} />} {/* Conditionally render the icon */}
                        {fname && !isValidFname && <FontAwesomeIcon icon={faXmark} className={styles.icon} style={{ "--icon-color": "red", "--icon-right": "10px" }} />}
                    </div>

                    <div className={styles.inputWrapper}>
                        <input
                            type="text"
                            placeholder="Last Name *"
                            autoComplete="new-password"
                            onChange={(e) => { setLname(e.target.value) }}
                            value={lname}
                            onFocus={() => setLnameFocus(true)}
                            onBlur={() => setLnameFocus(false)}
                            required />
                        {isValidLname && <FontAwesomeIcon icon={faCheck} className={styles.icon} style={{ "--icon-color": "green", "--icon-right": "10px" }} />}
                        {lname && !isValidLname && <FontAwesomeIcon icon={faXmark} className={styles.icon} style={{ "--icon-color": "red", "--icon-right": "10px" }} />}
                    </div>

                </div>

                <div className={styles.instructions}>
                    {((fnameFocus && fname && !isValidFname) || (lnameFocus && lname && !isValidLname)) &&
                        <p>Name must be between 2 to 10 characters. <br />
                            Must begin with a letter.<br />
                            Letters, numbers, underscores, hyphens allowed. No space is allowed.
                        </p>}
                </div>

                <div className={styles.inputWrapper}>
                    <input type="email"
                        placeholder="Email *"
                        // autoComplete="new-password"
                        onChange={(e) => { setEmail(e.target.value) }}
                        value={email}
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                        required />
                    {isValidEmail && <FontAwesomeIcon icon={faCheck} className={styles.icon} style={{ "--icon-color": "green", "--icon-right": "10px" }} />}
                    {email && !isValidEmail && <FontAwesomeIcon icon={faXmark} className={styles.icon} style={{ "--icon-color": "red", "--icon-right": "10px" }} />}
                </div>

                <div className={styles.inputWrapper}>
                    <input type={showPassword ? "text" : "password"}
                        placeholder="Password *"
                        onChange={(e) => { setPWD(e.target.value) }}
                        value={pwd}
                        onFocus={() => setPWDFocus(true)}
                        onBlur={() => setPWDFocus(false)}
                        required />
                    {isValidPWD && <FontAwesomeIcon icon={faCheck} className={styles.icon} style={{ "--icon-color": "green" }} />}
                    {pwd && !isValidPWD && <FontAwesomeIcon icon={faXmark} className={styles.icon} style={{ "--icon-color": "red" }} />}
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className={styles.iconToggle}
                        onClick={togglePasswordVisibility}
                        style={{ "--icon-color": "grey" }}
                    />
                </div>
                <div className={styles.instructions}>
                    {pwdFocus && pwd && !isValidPWD &&
                        <p>Password must be between 8 to 24 characters. <br />
                            Must include uppercase, lowercase letters, a number and a special character.<br />
                            Allowed special chars - !@#$%.
                        </p>}
                </div>

                <div className={styles.inputWrapper}>
                    <input type={showPasswordMatch ? "text" : "password"}
                        placeholder="Confirm Password *"
                        onChange={(e) => { setPWDMatch(e.target.value) }}
                        value={pwdMatch}
                        onFocus={() => setPWDMatchFocus(true)}
                        onBlur={() => setPWDMatchFocus(false)}
                        required />
                    {pwdMatch && isValidPWDMatch && <FontAwesomeIcon icon={faCheck} className={styles.icon} style={{ "--icon-color": "green" }} />}
                    {pwdMatch && !isValidPWDMatch && <FontAwesomeIcon icon={faXmark} className={styles.icon} style={{ "--icon-color": "red" }} />}
                    <FontAwesomeIcon
                        icon={showPasswordMatch ? faEyeSlash : faEye}
                        className={styles.iconToggle}
                        onClick={togglePasswordMatchVisibility}
                        style={{ "--icon-color": "grey" }}
                    />
                </div>

                <div className={styles.instructions}>
                    {pwdMatch && !isValidPWDMatch && (pwdFocus || pwdMatchFocus) && <p>Password Mismatch !</p>}
                </div>



                {/* <button type="submit" >Sign Up</button> */}
                <button
                    type="submit"
                    className="btn btn-success"
                    disabled={(isValidFname && isValidLname && isValidEmail && isValidPWD && isValidPWDMatch && !loading) ? false : true} >
                     {loading ? "Loading..." : "Sign Up"}
                </button>
            </form>
            <br />
            <p>Already have an account? <Link to="/auth/login">Log in</Link></p>
        </>
    );
}

export default Register;