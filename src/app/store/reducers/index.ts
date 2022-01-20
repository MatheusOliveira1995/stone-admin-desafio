import { combineReducers } from "redux";
import { usersSlice } from "../slices/users";
import { cardsSlice } from "../slices/cards"
import { toastSlice } from "../slices/toast"
import { auditsSlice } from "../slices/audits";

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    cards: cardsSlice.reducer,
    toast: toastSlice.reducer,
    audits: auditsSlice.reducer
})


export default rootReducer