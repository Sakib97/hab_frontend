import { Navigate, Outlet, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useProfileContext from "../../hooks/useProfileContext";


// { allowedRoles } is a prop here
const RequireAuth = ({ allowedRoles }) => {

    const { auth } = useAuth()
    const { profile } = useProfileContext()

    // console.log("allowedRoles:: ", allowedRoles);
    // console.log("email:: ", auth.email);
    // console.log("roles:: ", auth.roles);


    const location = useLocation();
    
    // If the user is not logged in, redirect to the login page
    if (!auth?.email ) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }

     // If the user is logged in but does not have the required roles, redirect to the unauthorized page
    //  if (!auth.roles?.some(role => allowedRoles.includes(role))) {
    if (!auth?.roles?.some(role => allowedRoles.includes(role))) {
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    // If the user is logged in and has the required roles, render the requested page
    return <Outlet />;
}
 
export default RequireAuth;