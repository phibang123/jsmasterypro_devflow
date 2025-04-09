interface SignInWithOAuthParams {
  provider: "github" | "google";
  providerAccountId: string;
  user: {
    username: string;
    name: string;
    image?: string;
    email: string;
  };
}
