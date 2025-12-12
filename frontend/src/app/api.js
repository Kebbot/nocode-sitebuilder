// frontend/src/app/api.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const apiBase = import.meta.env.VITE_API_BASE || '/api';

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: apiBase,
        prepareHeaders: (headers, { getState }) => {
            // 1) Пытаемся взять токен из Redux (если вдруг auth-редьюсер есть)
            const state = typeof getState === 'function' ? getState() : undefined;
            const reduxToken = state?.auth?.token;

            // 2) Пытаемся взять токен из localStorage (для нашего текущего случая)
            let storedToken = null;
            if (typeof window !== 'undefined') {
                try {
                    storedToken = localStorage.getItem('nsb_token');
                } catch {
                    storedToken = null;
                }
            }

            const token = reduxToken || storedToken;

            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Me', 'Projects', 'Pages', 'Elements', 'Assets'],
    endpoints: () => ({})
});
