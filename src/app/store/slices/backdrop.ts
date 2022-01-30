import { createSlice } from "@reduxjs/toolkit";

type BackdropSettings = {
    open: boolean
}

const initialState: BackdropSettings = {
    open: false
}

export const backdropSlice = createSlice({
    name: 'backdropSlice',
    initialState,
    reducers: {
        showBackdrop(state){
            state.open = true
        },
        hideBackdrop(state){
            state.open = false
        }
    }
})


export const { showBackdrop, hideBackdrop } = backdropSlice.actions