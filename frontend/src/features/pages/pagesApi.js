// frontend/src/features/pages/pagesApi.js
import { baseApi } from '../../app/api.js';

export const pagesApi = baseApi.injectEndpoints({
    endpoints: (b) => ({
        // список страниц проекта
        listPages: b.query({
            query: (projectId) => `/projects/${projectId}/pages`,
            // гарантируем массив
            transformResponse: (response) =>
                response?.pages ?? response ?? [],
            providesTags: (_result, _error, projectId) => [
                { type: 'Pages', id: projectId }
            ]
        }),

        // создание страницы
        // arg: { projectId, body: { name, slug? } }
        createPage: b.mutation({
            query: ({ projectId, body }) => ({
                url: `/projects/${projectId}/pages`,
                method: 'POST',
                body
            }),
            invalidatesTags: (_result, _error, { projectId }) => [
                { type: 'Pages', id: projectId }
            ]
        }),

        // удаление страницы
        // arg: { projectId, pageId }
        deletePage: b.mutation({
            query: ({ projectId, pageId }) => ({
                url: `/projects/${projectId}/pages/${pageId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, { projectId }) => [
                { type: 'Pages', id: projectId }
            ]
        })
    })
});

export const {
    useListPagesQuery,
    useCreatePageMutation,
    useDeletePageMutation
} = pagesApi;
