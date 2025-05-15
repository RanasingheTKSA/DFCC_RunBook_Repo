import {  createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState } from "../../app/store"

export interface UserState {
    userName: string
}

const initialState:UserState = {
    userName: "",
}

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        updateUser: (state:UserState, action: PayloadAction<string>) => {
            state.userName = action.payload;
        },
        resetAdminState: () => initialState,
    },
})

export const { updateUser, resetAdminState } = userSlice.actions
export const selectUser = (state: RootState) => state.user
export default userSlice.reducer
