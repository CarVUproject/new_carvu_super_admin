import { TAG_TYPES } from '@/constants/api.constants';
import { baseApi } from '@/store/baseApi';
import { GetDealerRes, GetDealersRes } from './dealerSliceTypes';

export const dealerSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDealers: builder.query<GetDealersRes, void>({
      query: () => '/dealers/',
      providesTags: [TAG_TYPES.GET_DEALER],
    }),
    getDealer: builder.query<GetDealerRes, string>({
      query: (id: string) => `/dealers/${id}/`,
      providesTags: (result, error, id) => [{ type: TAG_TYPES.GET_DEALER, id }],
    }),
    updateDealer: builder.mutation<GetDealersRes, { id: string; body: Record<string, any> }>({
      query: ({ id, body }) => ({
        url: `/dealers/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: [TAG_TYPES.GET_DEALER],
    }),
    deleteDealer: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/dealers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAG_TYPES.GET_DEALER],
    }),
  }),
});

export const {
  useGetDealersQuery,
  useGetDealerQuery,
  useUpdateDealerMutation,
  useDeleteDealerMutation,
} = dealerSlice;
