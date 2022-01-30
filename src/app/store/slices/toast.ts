import { createSlice } from "@reduxjs/toolkit";

export type ToastSettings = {
    visible: boolean,
    color: "error" | "warning" | "success" | "info" | undefined,
    message: string
}

const initialState: ToastSettings = {
    visible: false,
    color: undefined,
    message: ''
}



export const toastSlice = createSlice({
    name: 'toastSlice',
    initialState,
    reducers:{
        show(state, action) {
            state.visible = true
            state.message = action.payload
        },
        hide: (state) => {
            state.visible = false
            state.color = undefined
            state.message = ''
        },
        error(state, action){
            state.visible = true
            state.message = action.payload
            state.color = 'error'
        },
        warning(state, action){
            state.visible = true
            state.message = action.payload
            state.color = 'warning'
        },
        success(state, action){
            state.visible = true
            state.message = action.payload
            state.color = 'success'
        },
        info(state, action){
            state.visible = true
            state.message = action.payload
            state.color = 'info'
        }
        
    }

})

export const { error, warning, success, info, hide } = toastSlice.actions
