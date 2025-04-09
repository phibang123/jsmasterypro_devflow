import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { constructorApi } from "./lib/api";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub!;
      return session;
    },
    async jwt({ token, account }) {
      if (account) {
        const convertProviderId =
          account.type === "credentials"
            ? token.email!
            : account.providerAccountId;
        const { data: existingAccount, success } =
          await constructorApi.accounts.getByProvider(convertProviderId);
        if (!success || !existingAccount) return token;

        const userId = existingAccount.userId;

        if (userId) token.sub = userId.toString();
      }

      return token;
    },
    async signIn({ user, account, profile }) {
      if (account?.type === "credentials") return true; // login by username and password
      if (!account || !user) return false;

      // trong ! này chỉ áp dụng cho ts, (non-null assertion) đảm bảo giá trị không null
      // ví dụ type của user.name = "string" | null | undefined, thêm ! cho type của user.name always "string"
      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username:
          account.provider === "github"
            ? (profile?.login as string)
            : (user.name?.toLocaleLowerCase() as string),
      };
      // trong ! dùng để loại bỏ type null và undefined, nên nhớ phải đảm bảo type đó luôn không phải là null và undefined
      const { success } = await constructorApi.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
      });

      return success;
    },
  },
});
