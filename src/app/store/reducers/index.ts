import { combineReducers } from "redux";
import { usersSlice } from "../slices/users";

const rootReducer = combineReducers({
    users: usersSlice.reducer
})


export default rootReducer