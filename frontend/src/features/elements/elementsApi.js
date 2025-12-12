// frontend/src/features/elements/elementsApi.js
import { baseApi } from '../../app/api.js';

export const elementsApi = baseApi.injectEndpoints({
    endpoints: (b) => ({
        listElements: b.query({
            query: ({ projectId, pageId }) =>
                `/projects/${projectId}/pages/${pageId}/elements`,
            transformResponse: (response) => response?.elements ?? [],
            providesTags: (_result, _error, arg) => [
                { type: 'Elements', id: `${arg.projectId}_${arg.pageId}` }
            ]
        }),

        createElement: b.mutation({
            query: ({ projectId, pageId, body }) => ({
                url: `/projects/${projectId}/pages/${pageId}/elements`,
                method: 'POST',
                body
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Elements', id: `${arg.projectId}_${arg.pageId}` }
            ]
        }),

        updateElement: b.mutation({
            query: ({ projectId, pageId, elementId, body }) => ({
                url: `/projects/${projectId}/pages/${pageId}/elements/${elementId}`,
                method: 'PATCH',
                body
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Elements', id: `${arg.projectId}_${arg.pageId}` }
            ]
        }),

        deleteElement: b.mutation({
            query: ({ projectId, pageId, elementId }) => ({
                url: `/projects/${projectId}/pages/${pageId}/elements/${elementId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, arg) => [
                { type: 'Elements', id: `${arg.projectId}_${arg.pageId}` }
            ]
        })
    })
});

export const {
    useListElementsQuery,
    useCreateElementMutation,
    useUpdateElementMutation,
    useDeleteElementMutation
} = elementsApi;
