import styles from '../../../css/EditorArticleDetailsForRev.module.css'
import Modal from 'react-bootstrap/Modal';
import LowPriorityOutlinedIcon from '@mui/icons-material/LowPriorityOutlined';
import AssignmentTurnedInOutlinedIcon from '@mui/icons-material/AssignmentTurnedInOutlined';
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined';
import { postData } from '../../../utils/postDataUtils';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useMutation, useQueryClient } from 'react-query';
import { useRef, useState, useEffect } from 'react';
import { containsCharacter } from '../../../utils/slugAndStringUtil';

const EditorArticleDetailsActions = (props) => {
    const [action, setAction] = useState('')
    const [actionTextForModal, setActionTextForModal] = useState('')

    const ACTIONS_API = `/api/v1/article/article_actions/${action}`
    // Add a ref to the form
    const formRef = useRef(null);

    const [isAcceptable, setIsAcceptable] = useState(true)
    const [isReviseable, setIsReviseable] = useState(false)
    const [isRejectable, setIsRejectable] = useState(false)
    const [reviseReason, setReviseReason] = useState('')
    const [rejectReason, setRejectReason] = useState('')
    const queryClient = useQueryClient();
    const axiosPrivate = useAxiosPrivate();
    const axiosInst = axiosPrivate;



    const mutation = useMutation({
        mutationFn: postData,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('unrevArticleData');
            queryClient.invalidateQueries('editorNotisData');
            queryClient.invalidateQueries('editorRevArticlesData');
            queryClient.invalidateQueries('editorUnrevArticlesData');
        },
    });

    // for modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
        mutation.reset(); // Reset the mutation state when closing the modal
    }
    const handleShow = () => {
        setShow(true);
    }

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent page reload
        const clickedButton = e.nativeEvent.submitter; // The button that triggered the submit
        const buttonName = clickedButton.name; // The name of the button

        if (buttonName === 'acceptModalOK') {
            const data = {
                "article_id": props.article_id,
                "decision_comment": ''
            }
            console.log("acceptModalOK data", data);

            // sending data as an object (hence {}) to 
            // postData function via mutation 
            // mutation.mutate({ data: data, url: ACTIONS_API, axiosInstance: axiosInst });

            // setShow(false); // modal closed
        }
        if (buttonName === 'revisionModalOK') {
            const data = {
                "article_id": props.article_id,
                "decision_comment": reviseReason
            }
            console.log("revisionModalOK", data, "\nACTIONS_API", ACTIONS_API, "\naction", action);
            // mutation.mutate({ data: data, url: ACTIONS_API, axiosInstance: axiosInst });
            // setShow(false); // modal closed
            // setRejectReason('')
            // setReviseReason('')
            // setIsReviseable(false)
            // setIsRejectable(false)
            // setIsAcceptable(true)
        }

        if (buttonName === 'rejectModalOK') {
            const data = {
                "article_id": props.article_id,
                "decision_comment": rejectReason
            }
            console.log("rejectModalOK", data, "\nACTIONS_API", ACTIONS_API, "\naction", action);
            mutation.mutate({ data: data, url: ACTIONS_API, axiosInstance: axiosInst });
            // setShow(false); // modal closed
            // setRejectReason('')
            // setReviseReason('')
            // setIsReviseable(false)
            // setIsRejectable(false)
            // setIsAcceptable(true)
        }


        if (buttonName === 'revision') {
            setIsRejectable(false)
            setIsReviseable(true)
            setIsAcceptable(false)
            console.log("revision");

        }
        if (buttonName === 'reject') {
            console.log("reject");

            setIsReviseable(false)
            setIsRejectable(true)
            setIsAcceptable(false)
        }
        if (buttonName === 'revisionCancel') {
            setRejectReason('')
            setReviseReason('')
            setIsReviseable(false)
            setIsRejectable(false)
            setIsAcceptable(true)
            // console.log("revisionCCCC");

        }
        if (buttonName === 'rejectCancel') {
            console.log("rejectcancel");

            setRejectReason('')
            setReviseReason('')
            setIsReviseable(false)
            setIsRejectable(false)
            setIsAcceptable(true)
        }
    }

    return (
        <div>
            <form ref={formRef} onSubmit={handleSubmit}>
                <div className={styles.articleContainer}>
                    {isReviseable &&
                        <div>
                            <textarea placeholder="Specify Revisions *"
                                rows="3"
                                cols="35"
                                style={{
                                    backgroundColor: "#ede5d5",
                                    borderRadius: "10px",
                                    borderStyle: "solid",
                                    borderWidth: "3px",
                                    borderColor: "#b59607",
                                }}
                                value={reviseReason}
                                onChange={(e) => {
                                    if (containsCharacter(e.target.value)) {
                                        setReviseReason(e.target.value)
                                    } else {
                                        setReviseReason('')
                                    }
                                    // setReviseReason(e.target.value)
                                }}
                                type="text" />
                            <br />
                            <br />

                            <button style={{ borderRadius: "20px" }}
                                name='revisionCancel'
                                className="btn btn-danger" >
                                <i className="fa-solid fa-xmark" />
                            </button>
                            &nbsp;
                            <button style={{ borderRadius: "20px" }}
                                name='revisionOK'
                                disabled={!reviseReason}
                                onClick={() => {
                                    setActionTextForModal('Send for Revision')
                                    handleShow()
                                }}
                                className="btn btn-success" >
                                <i className="fa-solid fa-check" />
                            </button>
                        </div>
                    }

                    {isRejectable &&
                        <div>
                            <textarea placeholder="Specify Rejection Reasons *"
                                rows="3"
                                cols="35"
                                style={{
                                    backgroundColor: "#eddada",
                                    borderRadius: "10px",
                                    borderStyle: "solid",
                                    borderWidth: "3px",
                                    borderColor: "#c20808"
                                }}
                                value={rejectReason}
                                onChange={(e) => {
                                    if (containsCharacter(e.target.value)) {
                                        setRejectReason(e.target.value)
                                    } else {
                                        setRejectReason('')
                                    }
                                }}
                                type="text" />
                            <br />
                            <br />

                            <button style={{ borderRadius: "20px" }}
                                name='rejectCancel'
                                className="btn btn-danger" >
                                <i className="fa-solid fa-xmark" />
                            </button>
                            &nbsp;
                            <button style={{ borderRadius: "20px" }}
                                disabled={!rejectReason}
                                name='rejectOK'
                                onClick={() => {
                                    setActionTextForModal('Reject')
                                    handleShow()
                                }}
                                className="btn btn-success" >
                                <i className="fa-solid fa-check" />
                            </button>
                        </div>
                    }

                    {(isAcceptable && (!isReviseable || !isRejectable)) &&
                        <button style={{ margin: "4px" }}
                            name='accept'
                            onClick={() => {
                                setActionTextForModal('Approve')
                                handleShow()
                            }}
                            className='btn btn-success'>
                            <AssignmentTurnedInOutlinedIcon /> Publish Article
                        </button>}
                    &nbsp;

                    {(!isReviseable && !isRejectable) &&
                        <button style={{ margin: "4px" }} name='revision'
                            className='btn btn-warning'>
                            <LowPriorityOutlinedIcon /> Send for Revision
                        </button>}
                    &nbsp;

                    {(!isReviseable && !isRejectable) &&
                        <button style={{ margin: "4px" }}
                            name='reject'
                            className='btn btn-danger'>
                            <BlockOutlinedIcon />  Reject Article
                        </button>}
                </div>


                <Modal aria-labelledby="contained-modal-title-vcenter" centered
                    show={show} onHide={handleClose}
                    container={formRef.current}  // modal will be rendered inside <form><form/>
                // modal renders at the end of <body/> by defalut
                >

                    {/* <Modal.Header closeButton> */}
                    <Modal.Header style={{ display: "flex", justifyContent: "center" }}>
                        <Modal.Title>
                            {/* <span> Approve / Send for Revision / Reject Article ? </span> */}
                            <span> {actionTextForModal} Article ? </span>
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body style={{ display: "flex", justifyContent: "center" }}>
                        <span>
                            Once you <b>{actionTextForModal}</b>, you will be redirected to the "Review History" Page. <br />
                        </span>
                    </Modal.Body>

                    <Modal.Footer style={{ display: "flex", justifyContent: "center" }}>
                        <button style={{ borderRadius: "20px" }}
                            name='modalCancel'
                            className="btn btn-danger"
                            onClick={handleClose}
                        >
                            <i className="fa-solid fa-xmark" />
                        </button>
                        &nbsp;
                        <button style={{ borderRadius: "20px" }}
                            type='submit'
                            name={actionTextForModal === 'Approve' ? 'acceptModalOK' :
                                actionTextForModal === 'Send for Revision' ? 'revisionModalOK' :
                                    actionTextForModal === 'Reject' ? 'rejectModalOK' : ''
                            }
                            className="btn btn-success"
                            onClick={() => {
                                // handleClose();
                                if (actionTextForModal === 'Approve') {
                                    setAction('approved');
                                }
                                if (actionTextForModal === 'Send for Revision') {
                                    setAction('sent_for_edit');
                                }
                                if (actionTextForModal === 'Reject') {
                                    setAction('rejected');
                                }
                                // setAction('approved');
                            }}
                            disabled={mutation.isLoading} // Disable button while loading
                        >
                            {mutation.isLoading ? '...' : <i className="fa-solid fa-check" />}
                        </button>

                    </Modal.Footer>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {/* mutation.error.message */}
                        {mutation.isError &&
                            <p style={{ color: "red", textAlign: "center" }} >
                                Something went wrong 😞  <br />
                                Please try again !  </p>}

                        {actionTextForModal === 'Approve' && mutation.isSuccess && <p>✅ Post Created!</p>}
                        {actionTextForModal === 'Send for Revision' && mutation.isSuccess && <p>✅ Post Sent for Revision!</p>}
                        {actionTextForModal === 'Reject' && mutation.isSuccess && <p>✅ Post Rejected!</p>}
                    </div>
                </Modal>

            </form>
        </div>
    );
}

export default EditorArticleDetailsActions;