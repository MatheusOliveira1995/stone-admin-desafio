import { CaseReducer, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Users, User } from  '../definitions'

type State = Users

const initialState: Users = {
    users: []
}
const setUsers: CaseReducer<State, PayloadAction<User[]>> = (state, action) => {
    state.users = action.payload
}
export const usersSlice = createSlice({
    name: 'usersSlice',
    initialState,
    reducers:{
        setUsers
    }

})