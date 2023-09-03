import { createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const usersAdapter = createEntityAdapter({});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    registrasi: builder.mutation({
      query: (user) => ({
        url: "/users",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["Users"],
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (res) => {
        return res.sort((a, b) => b.name.localeCompare(a.name));
      },
      providesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: (user) => {
        const formData = new FormData();
        formData.append("id", user.id);
        formData.append("name", user.name);
        formData.append("email", user.email);
        formData.append("role", user.role);
        if (user.photo) {
          formData.append("photo", user.photo);
        }

        return {
          url: `/users/${user.id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useUpdateUserMutation,
  useRegistrasiMutation,
  useLoginMutation,
  useDeleteUserMutation,
} = apiSlice;

export const selectUserResult = apiSlice.endpoints.getUsers.select();

const selectUserData = createSelector(
  selectUserResult,
  (userResult) => userResult.data
);

export const {
  selectAll: selectAllUsers,
  selectById: selectUsersById,
  selectIds: selectUsersIds,
} = usersAdapter.getSelectors(selectUserData);
