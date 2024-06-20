import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputData : null
}

const profiledataSlice = createSlice({
    name            : 'profile',
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
});

export const profiledataActions = profiledataSlice.actions;
export default profiledataSlice;
