import {configureStore } from '@reduxjs/toolkit'
import bankdetailsDataSlice from './BankDetailsSlice';
import contactPersonDataSlice from './ContactPersonSlice';
import profiledataSlice from './CusProfileSlice';
import swmprojectstatusSlice from './SWMProjectStatusSlice';
import ULBDetailsSlice from './ULBDetailsSlice';

const custStore = configureStore({
    reducer : { 
        profiledata : profiledataSlice.reducer,
        contactdata : contactPersonDataSlice.reducer,
        swmdata     : swmprojectstatusSlice.reducer,
        ulbdata     : ULBDetailsSlice.reducer,
        bankdata    : bankdetailsDataSlice.reducer,
    }
});

export default custStore;