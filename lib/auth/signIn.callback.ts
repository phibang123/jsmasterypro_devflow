import { Account, Profile, User } from "next-auth";

import { constructorApi } from "@/lib/api";

interface ISignInParams {
  user: User;
  account: Account | null;
  profile: Profile | undefined;
}

const signInCallback = async ({ user, account, profile }: ISignInParams) => {
  if (account?.type === "credentials") return true;
  if (!account || !user) return false;

  const userInfo = {
    name: user.name!,
    email: user.email!,
    image: user.image!,
    username:
      account.provider === "github"
        ? (profile?.login as string)
        : (user.name?.toLocaleLowerCase() as string),
  };

  const { success } = await constructorApi.auth.oAuthSignIn({
    user: userInfo,
    provider: account.provider as "github" | "google",
    providerAccountId: account.providerAccountId,
  });

  return success;
};
export default signInCallback;
