import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";

import { constructorApi } from "@/lib/api";
import { SignInSchema } from "@/lib/validations";

export const credentialHandler = Credentials({
  async authorize(credentials) {
    const validatedFields = SignInSchema.safeParse(credentials);

    if (validatedFields.success) {
      const { email, password } = validatedFields.data;

      const { data: existingAccount } =
        await constructorApi.accounts.getByProvider(email);

      if (!existingAccount) return null;

      const { data: existingUser } = await constructorApi.users.getById(
        existingAccount.userId.toString(),
      );

      if (!existingUser) return null;

      const isValidPassword = await bcrypt.compare(
        password,
        existingAccount.password!,
      );
      if (isValidPassword) {
        return {
          id: existingUser.id,
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.image,
        };
      }
    }
    return null;
  },
});
