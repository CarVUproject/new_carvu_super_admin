import { TAG_TYPES } from '@/constants/api.constants';
import { baseApi } from '@/store/baseApi';
import { UserType } from '@/types/user.types';

export const userSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<UserType, void>({
      query: () => `/auth/profile/`,
      providesTags: [TAG_TYPES.GET_ME],
    }),
  }),
});

export const { useGetMeQuery } = userSlice;
