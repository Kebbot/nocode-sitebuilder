// frontend/src/features/projects/projectsApi.js
import { baseApi } from '../../app/api.js';

export const projectsApi = baseApi.injectEndpoints({
    endpoints: (b) => ({
        listProjects: b.query({
            query: () => '/projects',
            transformResponse: (response) =>
                response?.projects ?? response ?? [],
            providesTags: (result) =>
                result
                    ? [
                        ...result.map((p) => ({
                            type: 'Projects',
                            id: p.id
                        })),
                        { type: 'Projects', id: 'LIST' }
                    ]
                    : [{ type: 'Projects', id: 'LIST' }]
        }),

        createProject: b.mutation({
            query: (body) => ({
                url: '/projects',
                method: 'POST',
                body
            }),
            transformResponse: (response) =>
                response?.project ?? response,
            invalidatesTags: [{ type: 'Projects', id: 'LIST' }]
        }),

        deleteProject: b.mutation({
            query: (projectId) => ({
                url: `/projects/${projectId}`,
                method: 'DELETE'
            }),
            invalidatesTags: (_result, _error, id) => [
                { type: 'Projects', id },
                { type: 'Projects', id: 'LIST' }
            ]
        })
    })
});

export const {
    useListProjectsQuery,
    useCreateProjectMutation,
    useDeleteProjectMutation
} = projectsApi;
