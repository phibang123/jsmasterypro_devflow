import { ROUTES } from '@/constants';
import { IAccount } from '@/database/account.model';
import { IQuestion } from '@/database/question.model';
import { IUser } from '@/database/user.model';
import { PaginationSearchParamsIF } from '@/types/global';
import { QuestionModelIF, TagModelIF, UserModelIF } from '@/types/model';

import { axiosInstance } from './handlers/axios.handler';

export const constructorApi = {
  auth: {
    oAuthSignIn: ({ user, provider, providerAccountId }: ISignInWithOAuthParams) =>
      axiosInstance(ROUTES.SIGNIN_WITH_OATH, {
        method: 'POST',
        data: {
          user,
          provider,
          providerAccountId,
        },
      }),
    credentialsSignUp: (dataSignUp: IAuthCredentials) =>
      axiosInstance<IUserSignUpAndSignInResponse>(ROUTES.SIGNUP_WITH_CREDENTIALS, {
        method: 'POST',
        data: dataSignUp,
      }),
    credentialsSignIn: (dataSignIp: Pick<IAuthCredentials, 'email' | 'password'>) =>
      axiosInstance<IUserSignUpAndSignInResponse>(ROUTES.SIGNIN_WITH_CREDENTIALS, {
        method: 'POST',
        data: dataSignIp,
      }),
  },
  users: {
    getAll: () => axiosInstance<IUser[]>('/users'),
    getById: (id: string) => axiosInstance<UserModelIF>(`/users/${id}`),
    getEmail: (email: string) =>
      axiosInstance<UserModelIF>(`/users/email`, {
        method: 'POST',
        data: { email },
      }),
    create: (userData: Partial<IUser>) =>
      axiosInstance<IUser>('/users', {
        method: 'POST',
        data: userData,
      }),
    update: (id: string, userData: Partial<IUser>) =>
      axiosInstance<IUser>(`/users/${id}`, {
        method: 'PUT',
        data: userData,
      }),
    delete: (id: string) =>
      axiosInstance<IUser>(`/users/${id}`, {
        method: 'DELETE',
      }),
  },
  accounts: {
    getAll: () => axiosInstance<IAccount[]>('/auth/accounts'),
    getById: (id: string) => axiosInstance<IAccount>(`/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      axiosInstance<IAccount>(`/accounts/provider`, {
        method: 'POST',
        data: { providerAccountId },
      }),
    create: (accountData: Partial<IAccount>) =>
      axiosInstance<IAccount>('/accounts', {
        method: 'POST',
        data: accountData,
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      axiosInstance<IAccount>(`/accounts/${id}`, {
        method: 'PUT',
        data: accountData,
      }),
    delete: (id: string) =>
      axiosInstance<IAccount>(`/accounts/${id}`, {
        method: 'DELETE',
      }),
  },
  questions: {
    create: (questionData: ICreateQuestionParam & { userId: string }) =>
      axiosInstance<IQuestion>('/questions', {
        method: 'POST',
        data: questionData,
      }),
    getAll: (params: PaginationSearchParamsIF) =>
      axiosInstance<{
        questions: QuestionModelIF[];
        total: number;
        isNext: boolean;
      }>('/questions', {
        method: 'GET',
        params,
      }),
    getById: (id: string) => axiosInstance<QuestionModelIF>(`/questions/${id}`),
    updateById: (id: string, questionData: IQuestionUpdateData) =>
      axiosInstance<QuestionModelIF>(`/questions/${id}`, {
        method: 'PUT',
        data: questionData,
      }),
  },
  tags: {
    getAll: (params: PaginationSearchParamsIF) =>
      axiosInstance<{
        tags: TagModelIF[];
        total: number;
        isNext: boolean;
      }>('/tags', {
        method: 'GET',
        params,
      }),
    getQuestionsByTag: (tagId: string, params: IGetTagQuestionsParams) =>
      axiosInstance<{
        questions: QuestionModelIF[];
        total: number;
        isNext: boolean;
      }>(`/tags/${tagId}/questions`, {
        method: 'GET',
        params,
      }),
    getById: (id: string) => axiosInstance<TagModelIF>(`/tags/${id}`),
  },
};
