import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "../../api/axios";
import styles from '../../css/Register.module.css'
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ForgetPassResetPass = () => {
    const RESET_PASS_URL = "/api/v1/user/reset_pass_token"
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

    const [searchParams] = useSearchParams();

    const [pwd, setPwd] = useState('')
    const [isValidPWD, setIsValidPWD] = useState(false);
    const [pwdFocus, setPWDFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setIsValidPWD(PWD_REGEX.test(pwd))
    }, [pwd])

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        const v1 = PWD_REGEX.test(pwd)
        if (!v1) {
            setErrMsg("Invalid Entry");
            setLoading(false)
            return;
        }

        const reset_token = searchParams.get('token')
        try {
            const reset_pass_req = { "reset_token": reset_token, "new_password": pwd }
            const response = await axios.post(RESET_PASS_URL,
                JSON.stringify(reset_pass_req), {
                headers: { 'Content-Type': 'application/json' }
            }
            )

            setLoading(false); setSuccess(true)
            setPwd('')
        } catch (error) {
            setErrMsg('Server Error. Please Try again.');
            setSuccess(false);
            setLoading(false)
        }
    }
    return (
        <div >
            {success && <p style={{ color: "green", fontWeight: "bold" }}>
                Password Successfully changed. Please <Link to="/auth/login">Login</Link>
            </p>}
            {errMsg && <p style={{ color: "red", fontWeight: "bold" }}>Error : {errMsg}</p>}
            <h2>Set New Password</h2>
            <form onSubmit={handleSubmit} className={styles.registrationForm}>
                <div className={styles.inputWrapper}>
                    <input type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        onChange={(e) => { setPwd(e.target.value) }}
                        value={pwd}
                        onFocus={() => setPWDFocus(true)}
                        onBlur={() => setPWDFocus(false)}
                        required />
                    <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className={styles.iconToggle}
                        onClick={togglePasswordVisibility}
                        style={{ "--icon-color": "grey" }}
                    />
                </div>
                <div style={{ width: "300px" }} className={styles.instructions}>
                    {pwdFocus && pwd && !isValidPWD &&
                        <p>Password must be between 8 to 24 characters. <br />
                            Must include uppercase, lowercase letters, a number and a special character.<br />
                            Allowed special chars - !@#$%.
                        </p>}
                </div>

                <button type="submit"
                    className="btn btn-success"
                    disabled={(pwd && isValidPWD && !loading) ? false : true}>
                    {loading ? "Loading..." : "Reset Password"}
                </button>
            </form>

        </div>
    );
}

export default ForgetPassResetPass;