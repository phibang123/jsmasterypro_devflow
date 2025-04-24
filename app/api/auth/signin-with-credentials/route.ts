import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, UnauthorizedError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { SignInSchema } from "@/lib/validations/index";
import { UserModelIF } from "@/types/model";

// Step to signin with credentials
// 1. Validate request
// 2. Find account by email and compare password
// 3. Get user by userId account
// 4. Return user data

export async function POST(request: NextRequest) {
  try {
    logger.info("Starting signin with credentials");
    const [validatedRequest] = await Promise.all([
      validateRequest(request, SignInSchema),
      dbConnect(),
    ]);

    const { userId } =
      await findAccountByEmailAndComparePassword(validatedRequest);

    const user = await findUserByUserId(userId);
    const { id, image, name, email } = user;
    logger.info("Login by credentials is successful");
    return handleSuccess({
      data: { id, image, name, email },
      message: "Login by credentials is successful",
    });
  } catch (error) {
    return handleError({ error });
  }
}

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
