import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { credentialHandler } from "./lib/auth/credentials.provider";
import jwtCallback from "./lib/auth/jwt.callback";
import sessionCallback from "./lib/auth/session.callback";
import signInCallback from "./lib/auth/signIn.callback";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // 1.1 User login click login => auth provider platform
  providers: [GitHub, Google, credentialHandler], // Login
  callbacks: {
    // 1.4 Anywhere call session auth, will trigger this callback
    async session({ session, token }) {
      return sessionCallback({ session, token });
    },
    // 1.3 Developer trigger callback JWT after login success
    // By default code, I use JWT callback as middleware for setting session
    async jwt({ token, account }) {
      return jwtCallback({ token, account });
    },
    // 1.2 Developer trigger callback user user login by provider platform
    async signIn({ user, account, profile }) {
      return signInCallback({ user, account, profile });
    },
  },
});
