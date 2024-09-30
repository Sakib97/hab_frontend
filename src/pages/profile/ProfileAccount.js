import { useState, useRef, useEffect } from "react";
import styles from '../../css/ProfileAccount.module.css'
import useProfileContext from "../../hooks/useProfileContext";
import useAuth from "../../hooks/useAuth";
import toast, { Toaster } from 'react-hot-toast';
import { faEye, faEyeSlash, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios, { axiosPrivate } from "../../api/axios";
import Compress from "compress.js";
import ProfileAccountRole from "./ProfileAccountRole";
import { useLocation } from "react-router-dom";


const ProfileAccount = () => {
    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfileContext()
    const pwdRef = useRef();
    const fnameRef = useRef();

    const NAME_REGEX = /^[A-z][A-z0-9-_]{1,9}$/;
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EDIT_ACC_URL = "/api/v1/user/edit_profile"

    const [firstName, setFirstName] = useState(profile.first_name);
    const [isValidFname, setIsValidFname] = useState(false);
    const [fnameFocus, setFnameFocus] = useState(false);

    const [lastName, setLastName] = useState(profile.last_name);
    const [isValidLname, setIsValidLname] = useState(false);
    const [lnameFocus, setLnameFocus] = useState(false);

    const [pwd, setPWD] = useState('');
    const [isValidPWD, setIsValidPWD] = useState(false);
    const [pwdFocus, setPWDFocus] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [enablePWDEdit, setEnablePWDEdit] = useState(false);

    const [imageUrl, setImageUrl] = useState(profile.image_url)
    const [deleteImageUrl, setDeleteImageUrl] = useState(profile.delete_image_url)

    const [selectedFile, setSelectedFile] = useState(null);
    const [enableEdit, setEnableEdit] = useState(false)

    const [loading, setLoading] = useState(false)
    const [imgLoading, setImgLoading] = useState(false)

    const location = useLocation();
    useEffect(() => {
        // Dismiss all toasts when the component is unmounted
        return () => {
          toast.remove();
        };
      }, [location]); // Runs on page navigation


    useEffect(() => {
        if (enableEdit) {
            fnameRef.current.focus();
        }
    }, [enableEdit, fnameRef]);

    useEffect(() => {
        if (enablePWDEdit) {
            pwdRef.current.focus();
        }
    }, [enablePWDEdit, pwdRef]);

    useEffect(() => {
        setIsValidFname(NAME_REGEX.test(firstName))
    }, [firstName])

    useEffect(() => {
        setIsValidLname(NAME_REGEX.test(lastName))
    }, [lastName])

    useEffect(() => {
        setIsValidPWD(PWD_REGEX.test(pwd))
    }, [pwd])

    const handleEnableEdit = () => {
        setEnableEdit(true)
    }

    const handleEnablePWDEdit = () => {
        setEnablePWDEdit(true)
    }
    const handleCancelPWDEdit = () => {
        setEnablePWDEdit(false)
        setPWD('')
    }

    const togglePasswordVisibility = () => {
        setShowPassword(prevState => !prevState);
    };

    const handleCancelEdit = () => {
        setEnableEdit(false)
        setFirstName(profile.first_name)
        setLastName(profile.last_name)
        setImageUrl(profile.image_url)
        setPWD('')
        setEnablePWDEdit(false)
    }

    // for image
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // useEffect will automatically run when selectedFile changes
    useEffect(() => {
        if (selectedFile) {
            handleImgUpload();
        } else {
            // console.log("Sorry, no Image");
        }
    }, [selectedFile]);

    const makeToast = (msg, msg_type) => {
        switch (msg_type) {
            case 'success':
                toast.success(msg, { duration: 2000 });
                break;
            case 'error':
                toast.error(msg, { duration: 2000 });
                break;
            case 'info':
                toast(msg, { duration: 2000 });  // By default, toast is info
                break;
            default:
                toast(msg, { duration: 2000 });  // Fallback to basic toast
        }
    };

    const handleImgUpload = async () => {
        if (!selectedFile) {
            console.log("No Image");
            return;
        }

        if (!selectedFile.type.startsWith('image/')) {
            console.log("Not an Image !");
            makeToast("Not an Image !", 'error')
            return;
        }

        const sizeInMB = selectedFile.size / 1024 / 1024
        const maxSize = 0.4 // Limit size to 0.4 MB
        let resizedImage = selectedFile;

        // console.log("selected file:: ", selectedFile);

        if (sizeInMB > maxSize) {
            const compressor = new Compress();
            resizedImage = await compressor.compress(selectedFile, {
                size: maxSize, // the max size in MB, defaults to 2MB
                quality: 1, // the quality of the image, max is 1,
                maxWidth: 300, // the max width of the output image, defaults to 1920px
                maxHeight: 300, // the max height of the output image, defaults to 1920px
                resize: true // defaults to true, set false if you do not want to resize the image width and height
            })
        }

        // console.log("resizedImage file:: ", resizedImage);

        setImgLoading(true)
        const reader = new FileReader();
        reader.readAsDataURL(resizedImage);

        reader.onloadend = async () => {
            const base64Image = reader.result.split(',')[1]; // Extract Base64 data without metadata
            const formData = new FormData();
            formData.append('image', base64Image)

            try {
                const response = await axios.post(
                    `https://api.imgbb.com/1/upload`,
                    formData, {
                    params: {
                        key: '597007038c4acb4322ab05e332d4fb80',
                        name: `${profile.user_email}_avatar`
                    },
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
                );
                const imgUrl = response.data.data.url;
                const deleteUrl = response.data.data.delete_url;
                setImageUrl(imgUrl); setDeleteImageUrl(deleteUrl)

                // delete previous image while uploading a new image via api can be implemented later
                // or we can limit the number of times image can be changed
                // console.log("imageUrl, delete_rul:: ", imgUrl, deleteUrl);

                setImgLoading(false)
                // console.log("imageUrl, delete_rul:: ", imgUrl, deleteUrl);
                setSelectedFile(null) //preventing image upload on refresh

            } catch (error) {
                makeToast("Error uploading image", 'error')
                console.log("Error uploading image");
                setImgLoading(false)
                setSelectedFile(null) //preventing image upload on refresh
            }
        }
    }



    const handleSubmit = async (event) => {
        setLoading(true)
        event.preventDefault();
        // if button enabled with JS hack
        const v1 = NAME_REGEX.test(firstName)
        const v2 = NAME_REGEX.test(lastName)
        const v3 = pwd ? PWD_REGEX.test(pwd) : true; // Only validate if pwd is present
        if (!v1 || !v2 || !v3) {
            setLoading(false)
            makeToast("Invalid Entry", 'error')
            return;
        }
        try {
            const edit_obj = {
                "first_name": firstName,
                "last_name": lastName,
                "password": pwd, "image_url": imageUrl, "delete_image_url": deleteImageUrl ? deleteImageUrl : ""
            }
            console.log("edit:: ", JSON.stringify(edit_obj));

            const response = await axiosPrivate.put(EDIT_ACC_URL,
                JSON.stringify(edit_obj),
            )
            setLoading(false)

            setProfile(prev => { return { ...prev, first_name: firstName, last_name: lastName, image_url: imageUrl } })
            // console.log("profile:: ", profile);
            setFirstName(firstName)
            setLastName(lastName)
            setPWD('');

            setEnableEdit(false)
            makeToast("Updated successfully !", 'success')
        } catch (err) {
            if (!err?.response) {
                setLoading(false)
                makeToast("No Server Response", 'error')
            } else {
                setLoading(false)
                makeToast("Update Failed. Try Again.", 'error')
            }
        }
    }


    return (
        <div>
            <div><Toaster /></div>
            <div className={styles.profileContainer}>
                <div className={styles.profileImageContainer}>
                    <div className={styles.imageWrapper}>
                        <img
                            src={imageUrl}
                            alt="Profile"
                            className={styles.profileImage}
                        />

                        {enableEdit &&
                            <label htmlFor="fileInput" className={styles.customFileInput}>
                                {imgLoading ? "..." : <i className="fa-solid fa-pen-to-square" />}
                            </label>}
                        {enableEdit && <input
                            type="file"
                            accept="image/*"
                            id="fileInput"
                            className={styles.hiddenFileInput}
                            onChange={handleFileChange}
                            disabled={imgLoading}
                        />}

                    </div>

                </div>

                <div className={styles.profileInfo}>
                    <form onSubmit={handleSubmit} className={styles.profileInfo}>
                        <div className={styles.row}>
                            <input
                                type="text"
                                value={firstName}
                                ref={fnameRef}
                                onChange={(e) => setFirstName(e.target.value)}
                                className={styles.inputField}
                                onFocus={() => setFnameFocus(true)}
                                onBlur={() => setFnameFocus(false)}
                                disabled={enableEdit ? false : true}
                            />
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className={styles.inputField}
                                onFocus={() => setLnameFocus(true)}
                                onBlur={() => setLnameFocus(false)}
                                disabled={enableEdit ? false : true}
                            />
                        </div>
                        {((fnameFocus && firstName && !isValidFname) || (lnameFocus && lastName && !isValidLname)) &&
                            <div className={styles.instructions}>
                                <div>Name must be between 2 to 10 characters. Must begin with a letter. <br />
                                    Letters, numbers, underscores, hyphens allowed. No space is allowed.
                                </div>

                            </div>}

                        <div className={styles.row}>
                            <input
                                type="email"
                                value={profile.user_email}
                                className={styles.inputField}
                                disabled
                            />
                        </div>
                        {enableEdit && <div className={styles.row}>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={pwd}
                                ref={pwdRef}
                                onChange={(e) => { setPWD(e.target.value) }}
                                className={styles.inputField}
                                placeholder="New Password"
                                onFocus={() => setPWDFocus(true)}
                                onBlur={() => setPWDFocus(false)}
                                disabled={(enableEdit && enablePWDEdit) ? false : true}

                            />
                            {enableEdit && enablePWDEdit && <FontAwesomeIcon
                                icon={showPassword ? faEyeSlash : faEye}
                                className={styles.iconToggle}
                                onClick={togglePasswordVisibility}
                                style={{ "--icon-color": "grey" }}
                            />}
                            {!enablePWDEdit && <button className="btn btn-light"
                                onClick={handleEnablePWDEdit}
                                disabled={(isValidFname && isValidLname) ? false : true}
                            >
                                <i className="fa-solid fa-pen-to-square" />
                            </button>}
                            {enablePWDEdit && <button className="btn btn-light" onMouseDown={handleCancelPWDEdit}><i className="fa-solid fa-xmark" /></button>}

                        </div>}

                        {enablePWDEdit && pwdFocus && pwd && !isValidPWD &&
                            <div className={styles.instructions}>
                                <div>Password must be between 8 to 24 characters. <br />
                                    Must include uppercase, lowercase letters, a number and a special character.<br />
                                    Allowed special chars - !@#$%.
                                </div>
                            </div>
                        }

                        {!enableEdit && <button onClick={handleEnableEdit} className="btn btn-primary"> Edit </button>}

                        {enableEdit && <div className={styles.buttonRow}>
                            <button style={{borderRadius: "20px"}} className="btn btn-success"
                                disabled={(isValidFname && isValidLname && !loading) ? false : true}>
                                {loading ? <i className="fa-solid fa-spinner" /> : <i className="fa-solid fa-check" />}
                            </button>
                            <button style={{borderRadius: "20px"}} onMouseDown={handleCancelEdit} className="btn btn-danger"><i className="fa-solid fa-xmark" /></button>
                        </div>}
                    </form>
                </div>
            </div>

            <ProfileAccountRole />
        </div>
    );
}

export default ProfileAccount;