
import { configureStore } from '@reduxjs/toolkit';
import boardReducer from './Slice.tsx'; 

const store = configureStore({
  reducer: {
    Board: boardReducer, 
  },
  devTools: true, 
});

export default store;
