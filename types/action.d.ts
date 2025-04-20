interface ISignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    username: string;
    name: string;
    image: string;
    email: string;
  };
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
