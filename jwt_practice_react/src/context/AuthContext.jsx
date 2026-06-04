import { createContext, useContext, useState } from 'react'
import { api } from '../api/axios';
import { API_ENDPOINT } from '../constants/apiConstants';
import { setAccessToken } from '../service/AccessTokenService';

const AuthContext =createContext();

export const AuthProvider = ({children}) => {

    const [user,setUser]=useState(null); // user state to store the user data, initially null

    const login = async (data) => {
    const res = await api.post(API_ENDPOINT.LOGIN, data);
    console.log(res);
     setUser(res.data.user);
     setAccessToken(res.data.accessToken);
  };

  const logout = async () => {
    await api.post(API_ENDPOINT.LOGOUT), // call the logout API to clear the refresh token cookie
    setUser(null), // clear the user state
    setAccessToken(null) // clear the access token in the token management service
  }

  return (
    <AuthContext.Provider value={{user,setUser,login,logout}}>
        {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){ // custom hook for not repeating useContext(AuthContext) in every component
    return useContext(AuthContext);
}
