import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";


const RequireNoAuth = () => {
    const { auth } = useAuth()
    const location = useLocation();
    const navigate = useNavigate()

    const from = location.state?.from?.pathname || "/"
    console.log("location:: ", from);

    return ( 
        auth?.email 
        ? <Navigate to="/profile" state={{ from: location }} replace />
        // ? navigate(from, {replace: true})
        : <Outlet/>

        // !auth?.email && <Outlet/> 
     );
}
 
export default RequireNoAuth;