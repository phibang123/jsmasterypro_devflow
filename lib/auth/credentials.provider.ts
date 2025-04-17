import Credentials from "next-auth/providers/credentials";

import { AuthorizeCredentialsSchema } from "@/lib/validations";

export const credentialHandler = Credentials({
  async authorize(credentials) {
    if (!credentials.userDefined) return null;
    const accountData = JSON.parse(credentials.userDefined as string);
    const validatedFields = AuthorizeCredentialsSchema.safeParse(accountData);
    return validatedFields.success ? validatedFields.data : null;
  },
});
