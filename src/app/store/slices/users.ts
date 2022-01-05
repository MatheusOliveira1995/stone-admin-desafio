import { createSlice } from "@reduxjs/toolkit";
import { Users } from  'src/app/definitions'

const initialState: Users = {
    users: []
}

export const usersSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers:{
        setUsers(state, action){
            return{...state, users: action.payload}
        }
    }

})

export const { setUsers } = usersSlice.actions
