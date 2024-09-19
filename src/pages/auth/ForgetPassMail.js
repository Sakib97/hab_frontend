import { useState, useRef, useEffect } from 'react';
import styles from '../../css/Register.module.css'
import axios from '../../api/axios';

const ForgetPassMail = () => {
    const PASS_RESET_MAIL_URL = '/api/v1/user/reset_pass_email'
    const emailRef = useRef()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    const [successMsg, setSuccessMsg] = useState(false);


    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault();
        try {
            const pass_email_req = { "email": email }
            const response = await axios.post(PASS_RESET_MAIL_URL,
                JSON.stringify(pass_email_req), {
                headers: { 'Content-Type': 'application/json' }
            }
            )

            // console.log(JSON.stringify(response?.data));

            setSuccess(true)
            setSuccessMsg(`Password reset link has been sent to : ${email}. Link will be valid for next five (05) minutes`)
            setEmail('')
            setErrMsg('')
            setLoading(false)
        } catch (error) {
            // console.log("reset mail error: ", error);
            setErrMsg('Server Error. Please Try again.');
            setSuccess(false);
            setLoading(false)
        }
    }

    return (
        <div className={styles.registrationForm}>
            {success &&
                <p style={{ color: "green", fontWeight: "bold" }}>
                    {successMsg}
                </p>}
            {errMsg && <p style={{ color: "red", fontWeight: "bold" }}>Error : {errMsg}</p>}

            <h4>Reset Password</h4>
            <form onSubmit={handleSubmit}>
                <input type="email"
                    placeholder="Email"
                    ref={emailRef}
                    onChange={(e) => { setEmail(e.target.value) }}
                    value={email}
                    required />
                {/* <button type="submit"
                    className="btn btn-success">
                        Submit
                </button> */}
                <button type="submit"
                    className="btn btn-success"
                    disabled={(email && !loading) ? false : true}>
                    {loading ? "Loading..." : "Submit"}
                </button>
            </form>
        </div>
    );
}

export default ForgetPassMail;