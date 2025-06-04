import { Input } from "antd";
import styles from "../../css/ProfileNote.module.css";
import { AutoComplete } from "antd";
import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import { fetchData } from "../../utils/getDataUtil";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { getRoleBadges } from "../../utils/roleUtil";

const ProfileNote = () => {
    const { auth } = useAuth();
    const current_user_mail = auth?.email;
    const [searchTerm, setSearchTerm] = useState("");

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
    const GET_USER_AND_NOTES_URL = `/api/v1/notes/get_user_note_by_mail/${targetUsermail}/${current_user_mail}`;
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
    const { data: noteSubjectListData, error: noteSubjectListError,
        isLoading: noteSubjectListLoading } = useQuery(
            ['noteSubjectListData', GET_USER_AND_NOTES_URL],
            () => fetchData(GET_USER_AND_NOTES_URL, axiosInst),
            {
                enabled: !!targetUsermail, // only run if targetUsermail is set
                refetchOnWindowFocus: false,
            }
        );
    const options = searchUserListData?.map((user) => ({
        value: `${user?.full_name}`,
        label: `${user?.full_name} (${user?.email})`,
        userObj: user // Store the user object for later use
    }));

    // const { Search } = Input;
    // const onSearch = (value) => {
    //     console.log(value);
    //     // Implement search functionality here
    // };

    const onSelect = (value, option) => {
        const selectedUser = option.userObj;
        console.log("Selected user:", selectedUser);

        // Set target user email to trigger notes fetch
        setTargetUsermail(selectedUser.email);
    };

    return (
        <div style={{
            width: "100%",
            padding: "20px"
        }}>
            <h1>Note</h1>
            <hr />
            {/* <Search placeholder="input search text" allowClear
                onSearch={onSearch}
                style={{ width: '500px' }} /> */}
            {/* <br /> <br /> */}

            <div style={{
                width: "100%",
                display: "flex", justifyContent: "center"
            }}>
                {/* <input className={styles.searchInput}
                    type="text"
                    placeholder="Search username / email.."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                /> */}
                <br />
                <AutoComplete
                    className={styles.searchInput}
                    style={{ height: 50 }}
                    options={options}
                    onSelect={onSelect}
                    onSearch={setSearchTerm}
                    placeholder="Search username / email..  "
                    allowClear
                    filterOption={false}
                />

            </div>
            <br />
            <div>
                {noteSubjectListLoading && <h3 style={{
                    padding: "30px", fontSize: "20px",
                    display: 'flex', justifyContent: 'center'
                }}>
                    Loading...</h3>}

                {noteSubjectListError && <h3 style={{
                    padding: "30px", display: 'flex',
                    justifyContent: 'center', color: 'red',
                    fontWeight: 'bold', fontSize: '30px'
                }}>Server Error !</h3>}

                {noteSubjectListData &&
                    <div>
                        <div style={{ display: "flex",flexWrap:'wrap' }}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img style={{ height: 'auto', width: '30px', borderRadius: '20px' }}
                                    src={noteSubjectListData?.target_user?.image_url} alt="propic" />
                            </div>
                            <div style={{ padding: "10px", fontSize: "25px", fontWeight: "bold" }}>
                                {noteSubjectListData?.target_user?.full_name}
                            </div>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                {getRoleBadges(noteSubjectListData?.target_user?.roles)}
                            </div>
                        </div>

                        <hr />
                        <div className={styles.noteListContainer}>
                            {noteSubjectListData?.notes?.length > 0 ? (
                                noteSubjectListData.notes.map((note, index) => (
                                    <div key={index} className={styles.noteItem}>
                                        <h4>{note.title}</h4>
                                        {/* <p>{note.content}</p> */}
                                        <span className={styles.noteTime}>
                                            {new Date(note.created_at).toLocaleString()}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <p>No notes found for this user.</p>
                            )}
                        </div>
                    </div>
                }

            </div>

            <hr />
            <div className={styles.noteContainer}>
                <input className={styles.inputBox}
                    type="text" placeholder="Subject.." />
                <br />
                <textarea placeholder="Note.."
                    className={styles.noteTextArea}
                ></textarea>
                <br />
                <button className={styles.noteSubmitBtn}>
                    Send &nbsp; <i className="fa-solid fa-paper-plane"></i>
                </button>
            </div>




        </div>
    );
}

export default ProfileNote;