import { combineReducers } from "redux";
import { usersSlice } from "../slices/users";
import { cardsSlice } from "../slices/cards"

const rootReducer = combineReducers({
    users: usersSlice.reducer,
    cards: cardsSlice.reducer
})


export default rootReducer