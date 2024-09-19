import { useContext } from "react";
import ProfileContext from "../context/ProfileProvider";


const useProfileContext = () => {
    return useContext(ProfileContext);
}
 
export default useProfileContext;