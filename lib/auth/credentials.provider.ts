import Credentials from "next-auth/providers/credentials";

import { AuthorizeCredentialsSchemaAUTH } from "../validations/auth-credentials.validaiton";

export const credentialHandler = Credentials({
  async authorize(credentials) {
    if (!credentials.userDefined) return null;
    const accountData = JSON.parse(credentials.userDefined as string);
    const validatedFields =
      AuthorizeCredentialsSchemaAUTH.safeParse(accountData);
    return validatedFields.success ? validatedFields.data : null;
  },
});
