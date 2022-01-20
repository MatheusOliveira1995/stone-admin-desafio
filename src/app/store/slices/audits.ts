import { createSlice } from "@reduxjs/toolkit";
import { Audits } from  'src/app/definitions'

const initialState: Audits = {
    audits: []
}

export const auditsSlice = createSlice({
    name: 'auditsSlice',
    initialState,
    reducers:{
        setAudits(state, action){
            return{...state, audits: action.payload}
        }
    }

})

export const { setAudits } = auditsSlice.actions
