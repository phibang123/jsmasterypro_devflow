interface IUserFromLoginOAuth {
  name: string;
  username: string;
  email: string;
  image?: string | undefined;
}

interface ISignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: IUserFromLoginOAuth;
}

interface IAuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface ICreateQuestionParam {
  title: string;
  description: string;
  content: string;
  tags: string[];
}

interface IUpdateQuestionParam extends ICreateQuestionParam {
  questionId: string;
}
