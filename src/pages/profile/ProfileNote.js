import { Input } from "antd";
import styles from "../../css/ProfileNote.module.css";
import { AutoComplete } from "antd";
import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../utils/getDataUtil";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { getRoleBadges } from "../../utils/roleUtil";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getFormattedTime } from "../../utils/dateUtils";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { postData } from "../../utils/postDataUtils";
import { basicEncode } from "../../utils/encodeUtil";
import { xorEncode } from "../../utils/encodeUtil";

const ProfileNote = () => {
    const { auth } = useAuth();
    const current_user_mail = auth?.email;
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const location = useLocation();
    const basePath = '/profile/note';
    const isBaseRoute = location.pathname === basePath;
    const isDetailsRoute = location.pathname.startsWith(`${basePath}/details`);

    // Debounce the search term to avoid too many API requests
    // This will wait for 500ms after the last change before updating the debouncedTerm
    const [debouncedTerm, setDebouncedTerm] = useState("");
    const [targetUsermail, setTargetUsermail] = useState("");

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedTerm(searchTerm);
        }, 500); // wait for 500ms pause
        return () => clearTimeout(timeout);
    }, [searchTerm]);


    // console.log("searchTerm", searchTerm);
    const SEARCH_USER_LIST_URL = `/api/v1/search/search_uname_mail?query=${debouncedTerm}`;
    const GET_USER_AND_NOTES_URL = `/api/v1/notes/get_user_note_by_mail/${targetUsermail}/${xorEncode(current_user_mail)}`;

    const SEND_NEW_NOTE_URL = `/api/v1/notes/send_new_note/${targetUsermail}`;
    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    const { data: searchUserListData, error: searchUserListError,
        isLoading: searchUserListLoading } = useQuery(
            ['searchUserListData', SEARCH_USER_LIST_URL],
            () => fetchData(SEARCH_USER_LIST_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
                enabled: !!debouncedTerm // Only run the query if searchTerm is not empty
            }
        );
    const { data: userInfoAndNotesData, error: userInfoAndNotesError,
        isLoading: userInfoAndNotesLoading } = useQuery(
            ['userInfoAndNotesData', GET_USER_AND_NOTES_URL],
            () => fetchData(GET_USER_AND_NOTES_URL, axiosInst),
            {
                enabled: !!targetUsermail, // only run if targetUsermail is set
                refetchOnWindowFocus: false,
            }
        );
    const options = searchUserListData?.map((user) => ({
        value: `${user?.full_name}`,
        // label: `${user?.full_name} (${user?.email})`,
        label: `${user?.full_name}`,
        userObj: user // Store the user object for later use
    }));

    const onSelect = (value, option) => {
        const selectedUser = option.userObj;
        // console.log("Selected user:", selectedUser);

        // Set target user email to trigger notes fetch
        // setTargetUsermail(selectedUser.email);
        setTargetUsermail(selectedUser.user_slug);
    };

    //////// For sending new note //////////
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            // console.log("Note sent successfully");
            // Invalidate and refetch user info and notes data
            queryClient.invalidateQueries('userInfoAndNotesData');
        },
        onError: (error) => {
            console.error("Error sending note:", error);
        }
    });

    // ////////////For formik validation and submission of notes//////////
    const onFormSubmit = (values, actions) => {
        // console.log("Form submitted with values:", values);
        // Handle form submission logic here, e.g., send values to the server
        // Reset form after submission
        const data = {
            "subject_name": values.subject.trim(),
            "message_text": values.note.trim(),
        }
        mutation.mutate({ data: data, url: SEND_NEW_NOTE_URL, axiosInstance: axiosInst });
        actions.resetForm();
        // navigate(`/profile/note/details`, { replace: true });
        navigate(`/profile/note`, { state: { targetUsermail: targetUsermail } }); // Navigate to details page with state

    };
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleBlur, // validates the input when focus is lost
        handleChange,
        handleSubmit,
    } = useFormik({
        initialValues: {
            subject: '',
            note: ''
        },
        validationSchema: Yup.object({
            subject: Yup.string()
                .max(150, 'Subject must be 150 characters or less')
                .required('Subject is required')
                .test(
                    'not-only-whitespace',
                    'Subject cannot be empty or only whitespace',
                    (value) => value.trim().length > 0
                ),
            note: Yup.string()
                .max(1000, 'Note must be 1000 characters or less')
                .required('Note is required')
                .test(
                    'not-only-whitespace',
                    'Note cannot be empty or only whitespace',
                    (value) => value.trim().length > 0
                )
        }),
        onSubmit: (onFormSubmit)
    });



    return (
        <div style={{
            width: "100%",
            padding: "20px"
        }}>
            <h1>Note</h1>
            <hr />

            {isBaseRoute &&
                <div>
                    <div style={{
                        width: "100%",
                        display: "flex", justifyContent: "center"
                    }}>
                        <br />
                        <AutoComplete
                            className={styles.searchInput}
                            style={{ height: 50 }}
                            options={options}
                            onSelect={onSelect}
                            onSearch={setSearchTerm}
                            placeholder="Search username..."
                            allowClear
                            filterOption={false}
                        />

                    </div>
                    <br />
                    <div>
                        {userInfoAndNotesLoading && <h3 style={{
                            padding: "30px", fontSize: "20px",
                            display: 'flex', justifyContent: 'center'
                        }}>
                            Loading...</h3>}

                        {userInfoAndNotesError && <h3 style={{
                            padding: "30px", display: 'flex',
                            justifyContent: 'center', color: 'red',
                            fontWeight: 'bold', fontSize: '30px'
                        }}>Server Error !</h3>}

                        {userInfoAndNotesData &&
                            <div >
                                <div style={{ display: "flex", flexWrap: 'wrap', justifyContent: "center", alignItems: "center" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <img style={{ height: 'auto', width: '30px', borderRadius: '20px' }}
                                            src={userInfoAndNotesData?.target_user?.image_url} alt="propic" />
                                    </div>
                                    <Link to={`/user/${userInfoAndNotesData?.target_user?.user_slug}`}>
                                        <div style={{ padding: "10px", fontSize: "25px", fontWeight: "bold" }}>
                                            {userInfoAndNotesData?.target_user?.full_name}
                                        </div>
                                    </Link>

                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        {getRoleBadges(userInfoAndNotesData?.target_user?.roles)}
                                    </div>
                                </div>

                                <hr />
                                <div className={styles.noteContainer}>
                                    {userInfoAndNotesData?.notes?.length > 0 ? (
                                        userInfoAndNotesData?.notes?.map((note, index) => (
                                            <Link to={`/profile/note/details?n_id=${note.note_id}`}
                                                key={index}
                                                className={styles.noteItem}
                                                style={{ textDecoration: 'none', color: 'inherit' }}>
                                                <div key={index}>
                                                    <div style={{ fontSize: '22px', fontWeight: 'bold' }}>
                                                        {note.title}</div>
                                                    <div className={styles.noteTime}>
                                                        {/* {new Date(note.created_at).toLocaleString()} */}
                                                        {getFormattedTime(note.created_at)}
                                                    </div>
                                                </div>
                                            </Link>


                                        ))
                                    ) : (
                                        <p>You have no conversation with this user.</p>
                                    )}
                                </div>
                            </div>
                        }

                    </div>

                    <hr />
                    <div className={styles.noteContainer}>
                        {userInfoAndNotesData &&
                            <div> Send a Note to <b>{userInfoAndNotesData?.target_user?.full_name}</b>  </div>
                        }
                        <form onSubmit={handleSubmit} autoComplete="off"
                            className={styles.noteContainer}>
                            <input value={values.subject}
                                id="subject"
                                name="subject"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={styles.inputBox}
                                type="text" placeholder="*Subject.."
                                disabled={!userInfoAndNotesData ? true : false}
                            />
                            {errors.subject && touched.subject && (
                                <div className={styles.errorMessage}>{errors.subject}</div>
                            )}
                            <br />

                            <textarea placeholder="*Note.."
                                className={styles.noteTextArea}
                                id="note"
                                name="note"
                                value={values.note}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={!userInfoAndNotesData ? true : false}

                            ></textarea>
                            {errors.note && touched.note && (
                                <div className={styles.errorMessage}>{errors.note}</div>
                            )}
                            <br />

                            <button className={styles.noteSubmitBtn}
                                disabled={isSubmitting || !values.subject.trim() || !values.note.trim() || values.subject.error || values.note.error}
                                type="submit"
                            >
                                Send &nbsp; <i className="fa-solid fa-paper-plane"></i>
                            </button>
                        </form>

                    </div>
                </div>}


            {isDetailsRoute && <div>
                <Outlet />
            </div>}

        </div>
    );
}

export default ProfileNote;