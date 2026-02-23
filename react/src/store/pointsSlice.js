import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    x: 0,
    y: 0,
    r: 1,
};

export const pointsSlice = createSlice({
    name: 'points',
    initialState,
    reducers: {
        setX: (state, action) => {
            state.x = action.payload;
        },
        setY: (state, action) => {
            state.y = action.payload;
        },
        setR: (state, action) => {
            state.r = action.payload;
        },
        resetForm: () => initialState,
    },
});

export const { setX, setY, setR, resetForm } = pointsSlice.actions;
export default pointsSlice.reducer;