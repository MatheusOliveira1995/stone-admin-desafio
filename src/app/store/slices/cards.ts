import { createSlice } from "@reduxjs/toolkit";
import { Cards } from  'src/app/definitions'

const initialState: Cards = {
    cards: []
}

export const cardsSlice = createSlice({
    name: 'cardsSlice',
    initialState,
    reducers:{
        setCards(state, action){
            return{...state, cards: action.payload}
        }
    }

})

export const { setCards } = cardsSlice.actions
