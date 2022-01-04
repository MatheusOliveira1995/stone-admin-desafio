import { combineReducers } from "redux";
import { usersSlice } from "./users";

const rootReducer = combineReducers({
    users: usersSlice.reducer
})


export default rootReducer