import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
    const navigate = useNavigate()

    const goBack = () => navigate(-1)

    return ( 
        <div className="unauthorized">
            <h1> Unauthorized ! </h1>
            <h3> You don't have access to this page. </h3>
            <button onClick={goBack} className="btn btn-warning"> Go Back </button>
        </div>
        

     );
}
 
export default Unauthorized;