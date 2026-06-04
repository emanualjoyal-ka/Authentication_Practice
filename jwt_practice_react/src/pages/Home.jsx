import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { useGetProfile } from '../controller/authController';
import { api } from '../api/axios';
import { API_ENDPOINT } from '../constants/apiConstants';
import { useState } from 'react';

const Home = () => {
    const navigate = useNavigate();

    const {user,logout}=useAuth(); // get the user data from the context
    console.log(user);

    const {data:profile}=useGetProfile(); // get the user profile data from the controller using react-query

    const [text,setText]=useState('') // use state and everything should be above if statements or will get error

    if (!profile) return <p>Loading...</p>; // use like this always when react query is used or else gets error

    const handlelogout=async()=>{
        try {
            await logout(); // call the logout function from the context
            navigate("/"); // navigate to the login page after successful logout
        } catch (error) {
            console.log(error); // log the error message
        }
    }


    const handleClick=async ()=>{
            const res= await api.get(API_ENDPOINT.TEST);
            console.log(res.data.message);
            setText(res.data.message)
            console.log("Test API called successfully");
    }


  return (
    <div>
        <h1>Hello {user?.role} {user?.name}</h1>
        <button onClick={handlelogout}>Logout</button>
        <p>{profile._id}</p>
        <p>{profile.name}</p>
        <p>{profile.email}</p>
        <p>{profile.role}</p>
        <button onClick={handleClick}>Click Here</button>
        <p>{text}</p>
    </div>
  )
}

export default Home