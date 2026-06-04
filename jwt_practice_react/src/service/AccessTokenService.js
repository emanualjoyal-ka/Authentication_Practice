
let accessToken=null;

export const setAccessToken=(token)=>{
    accessToken=token;
    console.log(accessToken);
    
}

export const getAccessToken=()=>{
    return accessToken;
}

export const clearAccessToken=()=>{
    accessToken=null;
}