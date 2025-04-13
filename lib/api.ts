import ROUTES from "@/constants/routes";
import { IAccount } from "@/database/account.model";
import { IUser } from "@/database/user.model";
import { UserModelIF } from "@/types/model";

import { axiosInstance } from "./handlers/axios.handler";

export const constructorApi = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      axiosInstance(`/auth/${ROUTES.SIGNIN_WITH_OATH}`, {
        method: "POST",
        data: {
          user,
          provider,
          providerAccountId,
        },
      }),
    credentialSignUp: (dataSignUp: IAuthCredentials) =>
      axiosInstance(`/auth/${ROUTES.SIGNUP_WITH_CREDENTIALS}`, {
        method: "POST",
        data: dataSignUp,
      }),
  },
  users: {
    getAll: () => axiosInstance<IUser[]>("/users"),
    getById: (id: string) => axiosInstance<UserModelIF>(`/users/${id}`),
    getEmail: (email: string) =>
      axiosInstance<UserModelIF>(`/users/email`, {
        method: "POST",
        data: { email },
      }),
    create: (userData: Partial<IUser>) =>
      axiosInstance<IUser>("/users", {
        method: "POST",
        data: userData,
      }),
    update: (id: string, userData: Partial<IUser>) =>
      axiosInstance<IUser>(`/users/${id}`, {
        method: "PUT",
        data: userData,
      }),
    delete: (id: string) =>
      axiosInstance<IUser>(`/users/${id}`, {
        method: "DELETE",
      }),
  },
  accounts: {
    getAll: () => axiosInstance<IAccount[]>("/auth/accounts"),
    getById: (id: string) => axiosInstance<IAccount>(`/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      axiosInstance<IAccount>(`/accounts/provider`, {
        method: "POST",
        data: { providerAccountId },
      }),
    create: (accountData: Partial<IAccount>) =>
      axiosInstance<IAccount>("/accounts", {
        method: "POST",
        data: accountData,
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      axiosInstance<IAccount>(`/accounts/${id}`, {
        method: "PUT",
        data: accountData,
      }),
    delete: (id: string) =>
      axiosInstance<IAccount>(`/accounts/${id}`, {
        method: "DELETE",
      }),
  },
};
