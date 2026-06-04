import axios from "axios";
import { clearAccessToken, getAccessToken, setAccessToken } from "../service/AccessTokenService";
import { API_ENDPOINT } from "../constants/apiConstants";



export const api=axios.create({
    baseURL:"http://localhost:5000/api/",
    withCredentials:true
})


api.interceptors.request.use((config)=>{
    const token=getAccessToken();
    console.log(token);
    
    if(token){
        config.headers.Authorization=`Bearer ${token}`; //accessToken is sent in the Authorization header as a Bearer token
    }
    return config;
})


api.interceptors.response.use((response)=>response,async(error)=>{
    const originalRequest=error.config;
    
    if(error.response?.status===401 && !originalRequest._retry && originalRequest.url !== API_ENDPOINT.REFRESH){ // If the response status is 401 (Unauthorized) and the original request has not been retried yet, and the original request is not the refresh token endpoint
        originalRequest._retry=true;
       try {
        const refreshResponse=await api.post(API_ENDPOINT.REFRESH);
        console.log(refreshResponse);
        
        const newAccessToken=refreshResponse.data.accessToken;
        if(newAccessToken){
            // Update the access token in your token management service
            setAccessToken(newAccessToken);
            console.log(newAccessToken);
            // Retry the original request with the new access token
            originalRequest.headers.Authorization=`Bearer ${newAccessToken}`;
            return api(originalRequest);
        }
       } catch (error) {
        clearAccessToken();// If refresh token is invalid or expired, clear the access token and redirect to login page
        window.location.href = "/";
        }
    }
    return Promise.reject(error);
})