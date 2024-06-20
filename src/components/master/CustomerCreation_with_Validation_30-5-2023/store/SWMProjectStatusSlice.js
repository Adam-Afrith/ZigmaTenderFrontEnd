import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputData : null
}

const swmprojectstatusSlice = createSlice({
    name            : 'swmprojectstatus',
    initialState    : initialState,
    reducers        : {
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

export const swmprojectstatusActions = swmprojectstatusSlice.actions;
export default swmprojectstatusSlice;
