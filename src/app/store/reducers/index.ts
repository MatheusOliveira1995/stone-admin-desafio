import { combineReducers } from "redux";
import { usersSlice } from "../slices/users";
import { cardsSlice } from "../slices/cards"
import { toastSlice } from "../slices/toast"

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    cards: cardsSlice.reducer,
    toast: toastSlice.reducer
})


export default rootReducer