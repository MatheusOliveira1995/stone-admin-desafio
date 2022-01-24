import { createSlice } from "@reduxjs/toolkit";
import { Analyst } from 'src/app/definitions'

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
        logoutAnalyst(state) {
            state.id = 0
            state.email = ''
            state.roles = []
            state.userId = 0
        }
    }
})

export const { setAnalyst, logoutAnalyst } = analystSlice.actions