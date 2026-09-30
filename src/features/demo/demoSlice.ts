import { TAG_TYPES } from '@/constants/api.constants';
import { baseApi } from '@/store/baseApi';

export const demoSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTodo: builder.query({
      query: (id) => `/todos/${id}`,
      providesTags: [TAG_TYPES.GET_TODO],
    }),
  }),
});

export const { useGetTodoQuery } = demoSlice;
