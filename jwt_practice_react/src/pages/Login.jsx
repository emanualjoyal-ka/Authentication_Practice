import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router';

const Login = () => {

    const navigate=useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const data={
        email,
        password,
    }

    const handleSubmit=async (e)=>{
        e.preventDefault(); // prevent the default form submission behavior
        try {
            await login(data); // call the login function from the context with the form data
            // setAccessToken(response.accessToken); // log the response data (user data and access token)
            navigate("/home"); // navigate to the home page after successful login
        } catch (error) {
            console.log(error); // log the error message
        }
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
        <input 
            type="email" 
            placeholder='Email' 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        <input 
            type="password" 
            placeholder='Password' 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type='submit'>Login</button>
        </form>
    </div>
  )
}

export default Login