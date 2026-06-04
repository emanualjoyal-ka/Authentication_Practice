import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import { API_ENDPOINT } from "../constants/apiConstants";


export const useGetProfile=()=>{
    return useQuery({
        queryKey:["profile"],
        queryFn:async()=>{
            const response=await api.get(API_ENDPOINT.PROFILE);
            console.log(response);
            return response.data.user;
        }
    })
}