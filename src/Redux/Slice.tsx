import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    loading: false,
    error: null,
    boarddata: [],
    Getboarddata: [],
    Taskdata: [],
    GetTaskdata: [],
};

const taskSlice = createSlice({
    name: 'Board',
    initialState,
    reducers: {
        BordTileSuccess(state, action) {
            state.loading = false;
            state.boarddata = action.payload;
        },
        GetBordTileSuccess(state, action) {
            state.loading = false;
            state.boarddata = action.payload;
        },
        AddTaskToBoard(state, action) {
            state.Taskdata = action.payload;
        },
        GetAddTaskToBoard(state, action) {
            state.Taskdata = action.payload;
        },
    },

});

export const {
    GetBordTileSuccess,
    BordTileSuccess,
    AddTaskToBoard,
    GetAddTaskToBoard
} = taskSlice.actions;

export default taskSlice.reducer;
