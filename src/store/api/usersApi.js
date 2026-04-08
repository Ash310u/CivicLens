import { baseApi } from '@/store/api/baseApi';

const USERS_PATH = '/api/users';

const getListTags = (result = []) => [
  { type: 'User', id: 'LIST' },
  ...result
    .filter((user) => user?.id !== undefined && user?.id !== null)
    .map((user) => ({ type: 'User', id: user.id })),
];

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserById: builder.query({
      query: (id) => ({
        url: `${USERS_PATH}/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),

    createUser: builder.mutation({
      query: (payload) => ({
        url: USERS_PATH,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${USERS_PATH}/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USERS_PATH}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),

    getUserInsights: builder.query({
      query: (id) => ({
        url: `${USERS_PATH}/${id}/insights`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'UserInsights', id }],
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_PATH}/login`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [{ type: 'Session', id: 'CURRENT' }],
    }),

    createSession: builder.mutation({
      query: (credentials) => ({
        url: `${USERS_PATH}/session`,
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: [{ type: 'Session', id: 'CURRENT' }],
    }),

    getSession: builder.query({
      query: () => ({
        url: `${USERS_PATH}/session`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Session', id: 'CURRENT' }],
    }),
  }),
});

export const {
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserInsightsQuery,
  useLoginMutation,
  useCreateSessionMutation,
  useGetSessionQuery,
} = usersApi;
