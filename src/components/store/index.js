import {configureStore } from '@reduxjs/toolkit'
// import ULBDetailsSlice from './ULBDetailsSlice';
import UlbDataSlice from './UlbDataSlice';

const dashboardStore = configureStore({
    reducer : { 
        // ulbdata     : ULBDetailsSlice.reducer,
        ulbpopulation : UlbDataSlice.reducer,
    }
});

export default dashboardStore;