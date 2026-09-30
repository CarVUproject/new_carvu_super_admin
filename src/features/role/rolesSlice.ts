import { TAG_TYPES } from '@/constants/api.constants';
import { baseApi } from '@/store/baseApi';
import {
  CreateUpdateRoleType,
  ModulesResponseType,
  Role,
  RolesResponseType,
} from '@/types/roles.type';

export const roleSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRoles: builder.query<RolesResponseType, void>({
      query: () => ({
        url: `/roles`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.GET_ROLES],
    }),
    createRole: builder.mutation<Role, CreateUpdateRoleType>({
      query: (body) => {
        console.log('[RTK MUTATION] Create Role Body:>>', body);
        return {
          url: `/roles/`,
          method: 'POST',
          body,
        };
      },
      transformErrorResponse: (errorBody) => {
        const { data } = errorBody;
        const returnError = { name: (data as Record<string, any>)?.name?.[0] };
        return returnError;
      },
      invalidatesTags: [TAG_TYPES.GET_ROLES],
    }),

    getRole: builder.query<Role, string>({
      query: (name) => ({
        url: `/roles/${name}/`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.GET_ROLE],
    }),

    updateRole: builder.mutation<void, { name: string; body: CreateUpdateRoleType }>({
      query: ({ name, body }) => ({
        url: `/roles/${name}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [TAG_TYPES.GET_ROLES, TAG_TYPES.GET_ROLE],
    }),

    deleteRole: builder.mutation<void, string>({
      query: (name) => ({
        url: `/roles/${name}/`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAG_TYPES.GET_ROLES],
    }),

    getModules: builder.query<ModulesResponseType, void>({
      query: () => ({
        url: `/modules`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPES.GET_ROLE],
    }),
  }),
});

export const {
  useLazyGetRolesQuery,
  useGetRolesQuery,
  useGetRoleQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetModulesQuery,
} = roleSlice;
