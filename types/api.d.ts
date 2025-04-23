interface IUserSignUpAndSignInResponse {
  id: string;
  name: string;
  email: string;
  image: string;
}

interface IQuestionUpdateData extends ICreateQuestionParam {
  userId: string;
}
