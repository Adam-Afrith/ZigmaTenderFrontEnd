import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputData : null
}

const bankdetailsDataSlice = createSlice({
    name : 'bankdetails',
    initialState : initialState,
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

export const bankDetailsActions = bankdetailsDataSlice.actions;
export default bankdetailsDataSlice;