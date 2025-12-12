import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: 'ui',
    initialState: {
        leftOpen: true,
        rightOpen: true,
        gridSize: 8,
        snapToGrid: true,
        snapToElements: true
    },
    reducers: {
        toggleLeft(s) { s.leftOpen = !s.leftOpen; },
        toggleRight(s) { s.rightOpen = !s.rightOpen; },
        setGridSize(s, a) { s.gridSize = a.payload; },
        setSnapToGrid(s, a) { s.snapToGrid = a.payload; },
        setSnapToElements(s, a) { s.snapToElements = a.payload; }
    }
});

export const { toggleLeft, toggleRight, setGridSize, setSnapToGrid, setSnapToElements } = slice.actions;
export default slice.reducer;