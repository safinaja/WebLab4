import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: '/final4/api',
        credentials: 'include',
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json');
            return headers;
        },
    }),
    tagTypes: ['Points'],
    endpoints: (builder) => ({

        getPoints: builder.query({
            query: () => ({
                url: '/points',
                method: 'GET',
            }),
            providesTags: ['Points'],
        }),


        addPoint: builder.mutation({
            query: (point) => ({
                url: '/points',
                method: 'POST',
                body: point,
            }),
            invalidatesTags: ['Points'],
        }),


        checkAuth: builder.query({
            query: () => '/auth/check',
        }),


        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
        }),
    }),
});

export const {
    useGetPointsQuery,
    useAddPointMutation,
    useCheckAuthQuery,
    useLogoutMutation
} = api;
