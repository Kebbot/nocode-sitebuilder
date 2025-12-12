import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api.js';
import uiReducer from '../features/ui/uiSlice.js';
import authReducer from '../features/auth/authSlice.js';

export const store = configureStore({
    reducer: {
        [baseApi.reducerPath]: baseApi.reducer,
        ui: uiReducer,
        auth: authReducer
    },
    middleware: (gDM) => gDM().concat(baseApi.middleware)
});