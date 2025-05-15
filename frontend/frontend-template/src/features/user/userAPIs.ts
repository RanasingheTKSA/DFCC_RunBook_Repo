import {resetAdminState, updateUser} from "./userSlice"
import axios from "axios"
import {AnyAction, Dispatch} from "@reduxjs/toolkit";
import {HOST, PORT} from "../../components/const";

export interface ErrorResponse {
    timestamp: string,
    status: number,
    error: string,
    message: string
}

export interface UserLoginDetails {
    username: string,
    password: string,
    message?: string,
}

export const userLoginAPI = async (userData: UserLoginDetails, dispatch: Dispatch<AnyAction>) => {
    try {
        const response = await axios.post(`http://${HOST}:${PORT}/user/login`, userData);
        console.log(response);
        
        if(response.data == "INVALID_AUTH"){
            userData.message = "INVALID_AUTH";
        }else {
            userData.message = "Success";
            dispatch(updateUser(response.data as string));
            localStorage.setItem("user", response.data as string);
            localStorage.setItem("loginName", userData.username as string);
        }
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            dispatch(resetAdminState());
            console.error(error.response);
        } else {
            dispatch(resetAdminState());
            console.error({
                timestamp: new Date().toISOString(),
                status: 0,
                error: "Not Specified",
                message: "Error Occurred"
            });
        }
    }
};
