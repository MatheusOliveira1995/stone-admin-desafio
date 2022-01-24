import { createSlice } from "@reduxjs/toolkit";
import { Analyst } from  'src/app/definitions'

const initialState: Analyst = {
    id: 0,
    email: '',
    roles: [],
    userId: 0,
}

export const analystSlice = createSlice({
    name: 'analystSlice',
    initialState,
    reducers: {
        setAnalyst(state, action) {
            const payload = action.payload as Analyst
            state.id = payload.id
            state.email = payload.email
            state.userId = payload.userId
            state.roles = payload.roles
        },
    }
})

export const { setAnalyst } = analystSlice.actions