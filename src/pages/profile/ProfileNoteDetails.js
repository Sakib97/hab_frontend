import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styles from "../../css/ProfileNote.module.css";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { fetchData } from "../../utils/getDataUtil";
import { getFormattedTime } from "../../utils/dateUtils";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useFormik } from "formik";
import * as Yup from "yup";
import { postData } from "../../utils/postDataUtils";
import useAuth from "../../hooks/useAuth";
import { useEffect, useMemo, useState } from "react";

const ProfileNoteDetails = () => {
    const { auth } = useAuth()
    const user_email = auth?.email; // Get the user's email from auth context
    const navigate = useNavigate();

    const handleGoBack = () => {
        // navigate(-1); // This simulates clicking the browser's back button
        navigate(`/profile/note`); // Navigate to details page with state

    };

    const [searchParams, setSearchParams] = useSearchParams();
    const noteID = searchParams.get('n_id');
    const isNotification = searchParams.get('notification') === 'true';
    const notificationId = searchParams.get('id');
    const userType = searchParams.get('type');

    // const noteTitle = searchParams.get('title');
    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;

    const GET_NOTE_BY_ID_URL = `/api/v1/notes/get_note_by_sub_id/${noteID}`;
    // const SEND_NOTE_REPLY_URL = `/api/v1/notes/send_note_to_subject/${noteID}/${targetUsermail}`; // Use targetUsermail from state
    const MARK_NOTIFICATION_CLICKED_API = `/api/v1/notification/mark_notis_as_clicked/${userType}/${notificationId}`

    const { data: noteDetailsData, error: noteDetailsError,
        isLoading: noteDetailsLoading } = useQuery(
            ['noteDetailsData', GET_NOTE_BY_ID_URL],
            () => fetchData(GET_NOTE_BY_ID_URL, axiosInst),
            {
                keepPreviousData: true, // Preserve previous data while fetching new
                // staleTime: 600,  // Example option: Cache data for 6 seconds
                refetchOnWindowFocus: false,  // Disable refetch on window focus
            }
        );

    const targetUserEmail = useMemo(() => {
        if (!noteDetailsData?.note_subject) return null;

        const { sender_email, receiver_email } = noteDetailsData.note_subject;
        return sender_email === user_email ? receiver_email : sender_email;
    }, [noteDetailsData, user_email]);

    // API call for sending a note reply
    const SEND_NOTE_REPLY_URL = `/api/v1/notes/send_note_to_subject/${noteID}/${targetUserEmail}`;
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            // console.log("Note sent successfully");
            // Invalidate and refetch user info and notes data
            queryClient.invalidateQueries('noteDetailsData');
        },
        onError: (error) => {
            console.error("Error sending note:", error);
        }
    });

    // Formik setup for note reply
    const onFormSubmit = (values, actions) => {
        // const targetEmail = findTargetUsermail();
        // const SEND_NOTE_REPLY_URL = `/api/v1/notes/send_note_to_subject/${noteID}/${targetEmail}`;

        // console.log("Form submitted with values:", values, targetUsermail);
        const data = {
            "message_text": values.note.trim(),
        }
        mutation.mutate({ data: data, url: SEND_NOTE_REPLY_URL, axiosInstance: axiosInst });

        // Reset form after submission
        actions.resetForm();
        // navigate(`/profile/note/details?n_id=${noteID}`, { state: { targetUsermail: targetUsermail } }); // Navigate to details page with state
        navigate(`/profile/note/details?n_id=${noteID}`); 


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
            note: ''
        },
        validationSchema: Yup.object({
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


    // This is for marking the notification as clicked when entered this page 
        // via the notification link ----------------------------------------------
        const notisMutation = useMutation({
            mutationFn: postData,
            onSuccess: (response) => {
                // Invalidate and refetch
                queryClient.invalidateQueries('generalNotisData');
            },
        });
        useEffect(() => {
            if (isNotification && notificationId && userType) {
                notisMutation.mutate({
                    data: {},
                    url: MARK_NOTIFICATION_CLICKED_API,
                    axiosInstance: axiosInst
                });
            }
            else {
                return;
            }
        }, [isNotification, notificationId, userType]);
        // ---------------------------------------------------

    if (noteDetailsLoading) {
        return <h3 style={{ padding: "30px" }}>Loading...</h3>;
    }

        if (noteDetailsError) {

        return <h3 style={{
            padding: "30px",
            display: 'flex', justifyContent: 'center',
            color: 'red', fontWeight: 'bold', fontSize: '30px'
        }}>Server Error !</h3>;
    }


    return (<div>

        <div style={{ display: "flex", justifyContent: "center" }}>
            <div onClick={handleGoBack} className={styles.noteDetailsBackButton}>
                <i className="fa-solid fa-arrow-left"></i>
            </div>
        </div>


        {noteDetailsData &&
            <div>
                <div className={styles.noteDetailsHeader}>
                    <div>{noteDetailsData?.note_subject?.subject_name} </div>
                    <div style={{ fontSize: '18px', fontWeight: 'normal' }}>
                        by <strong>{noteDetailsData?.note_subject?.sender_name}</strong>
                        &nbsp; &nbsp;
                        <span style={{ color: 'gray', fontSize: '14px' }}>
                            {getFormattedTime(noteDetailsData?.note_subject?.created_at)}
                        </span>
                    </div>

                </div>


                <hr />
                {noteDetailsData?.messages?.map((message, index) => (
                    <div key={index} className={styles.noteContentBox}>
                        <div style={{ fontSize: '20px' }}>
                            <b>{message.sender_name}</b>
                            &nbsp; &nbsp;
                            <span style={{ color: 'gray', fontSize: '14px' }}>
                                {getFormattedTime(message?.created_at)}
                            </span>
                        </div>
                        <hr />
                        <div style={{ fontSize: '19px' }}>
                            {message.message_text}
                        </div>
                    </div>
                ))}

                <hr />
                <div>
                    <form onSubmit={handleSubmit} autoComplete="off"
                        className={styles.noteContainer}>
                        <textarea placeholder="*Reply.."
                            className={styles.noteTextArea}
                            id="note"
                            name="note"
                            value={values.note}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        ></textarea>
                        {errors.note && touched.note && (
                            <div className={styles.errorMessage}>{errors.note}</div>
                        )}
                        <br />

                        <button className={styles.noteSubmitBtn}
                            disabled={isSubmitting || !values.note.trim() || values.note.error}
                            type="submit"
                        >
                            Reply &nbsp; <i className="fa-solid fa-paper-plane"></i>
                        </button>
                    </form>
                </div>


            </div>
        }


    </div>);
}

export default ProfileNoteDetails;