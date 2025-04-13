import { Session } from "next-auth";
import { AdapterSession, AdapterUser } from "next-auth/adapters";
import { JWT } from "next-auth/jwt";

interface ISessionParams {
  session: { user: AdapterUser } & AdapterSession & Session;
  token: JWT;
}

const sessionCallback = async ({ session, token }: ISessionParams) => {
  session.user.id = token.sub!;
  return session;
};

export default sessionCallback;
