import { Account } from "next-auth";
import { JWT } from "next-auth/jwt";

import { constructorApi } from "@/lib/api";

interface IJwtParams {
  token: JWT;
  account: Account | null;
}

const jwtCallback = async ({ token, account }: IJwtParams) => {
  if (account) {
    const convertProviderId =
      account.type === "credentials" ? token.email! : account.providerAccountId;
    const { data: existingAccount, success } =
      await constructorApi.accounts.getByProvider(convertProviderId);

    if (!success || !existingAccount) return token;

    const userId = existingAccount.userId;

    if (userId) token.sub = userId.toString();
  }

  return token;
};

export default jwtCallback;
