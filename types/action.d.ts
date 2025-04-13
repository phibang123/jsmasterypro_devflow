interface SignInWithOAuthParams {
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
