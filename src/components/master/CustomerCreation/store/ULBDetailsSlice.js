import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    inputData : null,
}

const ULBDetailsSlice = createSlice({
    name         : 'ulbdetails',
    initialState : initialState,
    reducers     : {
        storeInput(state, action){
            let data = action.payload;
           
            state.inputData = {
                ... state.inputData,
               [data.name] : data.value
            }
        },

        resetInput(state){
            state.inputData = null;
        }
    }
})

export const ULBDetailsActions = ULBDetailsSlice.actions;
export default ULBDetailsSlice;