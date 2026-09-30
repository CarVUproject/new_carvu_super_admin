import { baseApi } from '@/store/baseApi';
import { LoginFormType as LoginReqBodyTypes, LoginResType } from '@/types/auth.types';

export const authSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResType, LoginReqBodyTypes>({
      query: (body) => ({
        url: `/tokens/obtain/`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authSlice;
