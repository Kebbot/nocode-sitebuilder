import { createSlice } from '@reduxjs/toolkit';

const tokenKey = 'nsb_token';

const initialState = {
    token: localStorage.getItem(tokenKey) || null,
    user: null
};

const slice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            state.token = action.payload.token;
            state.user = action.payload.user || null;
            if (state.token) localStorage.setItem(tokenKey, state.token);
        },
        clearAuth(state) {
            state.token = null;
            state.user = null;
            localStorage.removeItem(tokenKey);
        },
        setUser(state, action) {
            state.user = action.payload || null;
        }
    }
});

export const { setAuth, clearAuth, setUser } = slice.actions;
export default slice.reducer;