import { baseApi } from '../../app/api.js';

export const authApi = baseApi.injectEndpoints({
    endpoints: (b) => ({
        register: b.mutation({
            query: (body) => ({ url: '/auth/register', method: 'POST', body })
        }),
        login: b.mutation({
            query: (body) => ({ url: '/auth/login', method: 'POST', body })
        }),
        me: b.query({
            query: () => ({ url: '/auth/me' }),
            providesTags: ['Me']
        })
    })
});

export const { useRegisterMutation, useLoginMutation, useMeQuery } = authApi;