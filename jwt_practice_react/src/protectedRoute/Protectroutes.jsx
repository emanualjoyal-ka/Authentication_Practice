import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext'

const Protectroutes = ({children}) => {

    const {user}=useAuth(); // get the user data from the context

    if(!user){ // if user is not logged in, return the login page
        return <Navigate to="/" />; // navigate to the login page
    }

    return children; // if user is logged in, return the children components (home page)
}

export default Protectroutes