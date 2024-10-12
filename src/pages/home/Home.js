import useAuth from "../../hooks/useAuth";
import useProfileContext from "../../hooks/useProfileContext";


const Home = () => {
    const { auth } = useAuth()
    const {profile, setProfile} = useProfileContext()    


    return ( 
        <div className="home">
            <div className="container">
                <h1>This is Home page</h1>
                
                <h3>
                    Name: {auth.email}  {auth.roles}<br />
                    Full Name: {profile.first_name} {profile.last_name}
                    Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ullam, rem?
                </h3>
            </div>
        </div>
     );
}
 
export default Home;
