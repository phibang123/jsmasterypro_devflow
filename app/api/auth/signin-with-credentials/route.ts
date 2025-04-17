import bcrypt from "bcryptjs";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "@/lib/http.errors";
import { SignInSchema } from "@/lib/validations/index";
import { UserModelIF } from "@/types/model";

export async function POST(request: Request) {
  try {
    // Validate request
    const validatedRequest = await validateDataFromSignIp(request);

    // Process email and password for account
    const { userId } =
      await findAccountByEmailAndComparePassword(validatedRequest);

    // Get user by userId account
    const user = await findUserByUserId(userId);
    const { id, image, name, email } = user;
    return handleSuccess({
      data: { id, image, name, email },
      message: "Login by credentials is successful",
    });
  } catch (error) {
    return handleError({ error });
  }
}

const validateDataFromSignIp = async (request: Request) => {
  const { email, password } = await request.json();

  const validatedData = SignInSchema.safeParse({
    email,
    password,
  });
  if (!validatedData.success) {
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  }
  return validatedData.data;
};

const findAccountByEmailAndComparePassword = async (
  dataRequest: z.infer<typeof SignInSchema>,
) => {
  const { email, password } = dataRequest;
  const existingAccount = await Account.findOne({
    provider: "credentials",
    providerAccountId: email,
  });
  if (!existingAccount) throw new NotFoundError("Account");
  const isValidPassword = await bcrypt.compare(
    password,
    existingAccount.password!,
  );
  if (!isValidPassword)
    throw new UnauthorizedError("Email and password is incorrect");
  return existingAccount;
};

const findUserByUserId = async (userId: object) => {
  const user = (await User.findById(userId)) as UserModelIF;
  if (!user) throw new NotFoundError("User");
  return user;
};
