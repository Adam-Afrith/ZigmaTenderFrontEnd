import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    inputData : null
}

const contactPersonDataSlice = createSlice({
    name : 'contactperson',
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

export const contactPersonActions = contactPersonDataSlice.actions;
export default contactPersonDataSlice;