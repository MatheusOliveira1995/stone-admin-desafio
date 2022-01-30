import { combineReducers } from "redux";
import { usersSlice } from "../slices/users";
import { cardsSlice } from "../slices/cards";
import { toastSlice } from "../slices/toast";
import { auditsSlice } from "../slices/audits";
import { analystSlice } from "../slices/analyst";
import { backdropSlice } from "../slices/backdrop";

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    cards: cardsSlice.reducer,
    toast: toastSlice.reducer,
    audits: auditsSlice.reducer,
    analyst: analystSlice.reducer,
    backdrop: backdropSlice.reducer
})


export default rootReducer