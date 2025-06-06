interface IUserSignUpAndSignInResponse {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface IQuestionUpdateData extends ICreateQuestionParam {
  userId: string;
}

type RouteParams = {
  params: Promise<{ id: string }>;
};

interface IGetTagQuestionsParams extends Omit<PaginationSearchParamsIF, 'filter'> {
  tagId: string;
}
