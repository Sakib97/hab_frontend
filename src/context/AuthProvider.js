import { createContext, useState, useEffect } from "react";

// Create a Context, it will provide object to it's children, hence - {}
const AuthContext = createContext({})

export const AuthProvider = ({children}) => {
    // auth will hold states as a form of object
    // const [auth, setAuth] = useState({})
    const [auth, setAuth] = useState(() => {
        // Initialize state from localStorage, if available
        const storedAuth = localStorage.getItem('auth');
        return storedAuth ? JSON.parse(storedAuth) : {};
    });


    
    useEffect(() => {
        // Load user from localStorage
        const savedAuth = JSON.parse(localStorage.getItem('auth'));
        if (savedAuth) {
            setAuth(savedAuth);
        }
    }, []);

    useEffect(() => {
        // Save user to localStorage
        if (auth) {
            localStorage.setItem('auth', JSON.stringify(auth));
        } else {
            localStorage.removeItem('auth');
        }
    }, [auth]);

    return ( 
        // now the components I wrap with AuthProvider, 
        // all it's children will have access to auth and setAuth through AuthContext
        <AuthContext.Provider value={{auth, setAuth}}>
            {children}
        </AuthContext.Provider>
     );
}
 
export default AuthContext;