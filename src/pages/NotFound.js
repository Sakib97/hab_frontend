import { Link, useRouteError } from "react-router-dom";

const NotFound = () => {
    return ( 
        <div className="notfound">
            <div className="container">
            <h1>Sorry</h1>
            <h3>404 | Page Not Found</h3>
            <Link to="/"> Go Back to Home </Link>
            </div>
        </div>
     );
}
 
export default NotFound;