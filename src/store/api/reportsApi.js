import { baseApi } from '@/store/api/baseApi';

const REPORTS_PATH = '/api/reports';

export const reportsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReports: builder.query({
      query: () => ({
        url: REPORTS_PATH,
        method: 'GET',
      }),
      providesTags: (result = []) => [
        { type: 'Report', id: 'LIST' },
        ...result
          .filter((report) => report?.id !== undefined && report?.id !== null)
          .map((report) => ({ type: 'Report', id: report.id })),
      ],
    }),

    getReportById: builder.query({
      query: (id) => ({
        url: `${REPORTS_PATH}/${id}`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Report', id }],
    }),

    createReport: builder.mutation({
      query: (payload) => ({
        url: REPORTS_PATH,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [{ type: 'Report', id: 'LIST' }],
    }),

    updateReport: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${REPORTS_PATH}/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Report', id },
        { type: 'Report', id: 'LIST' },
      ],
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        url: `${REPORTS_PATH}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Report', id },
        { type: 'Report', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetReportByIdQuery,
  useCreateReportMutation,
  useUpdateReportMutation,
  useDeleteReportMutation,
} = reportsApi;
