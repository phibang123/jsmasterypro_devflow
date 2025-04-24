import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { z } from "zod";

import { ENV_CONFIG } from "@/configs/env.config";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { SignUpSchema } from "@/lib/validations/index";
import { UserModelIF } from "@/types/model";

// Step to signup with credentials
// 1. Validate request
// 2. Check user exist throw error if exist
// 3. Create user and account
// 4. Commit transaction

export async function POST(request: NextRequest) {
  const session = await mongoose.startSession();

  try {
    logger.info("Starting credentials sign-up process");

    const [validatedData] = await Promise.all([
      validateRequest(request, SignUpSchema),
      dbConnect(),
    ]);
    const { email, username } = validatedData;

    session.startTransaction();
    await throwErrorIfUserExist(email, username, session);

    const newUser = await handleUserCredentialsAndReturn(
      validatedData,
      session,
    );

    await session.commitTransaction();

    const { id, image, name } = newUser;
    logger.info("Sign up by credentials successful");
    return handleSuccess({
      data: { id, email, image, name },
      message: "Sign up by credentials successful",
      status: 201,
    });
  } catch (error) {
    await session.abortTransaction();
    logger.error("Sign-up process failed:", error);
    return handleError({ error }) as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}

const throwErrorIfUserExist = async (
  email: string,
  username: string,
  session: mongoose.ClientSession,
) => {
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  }).session(session);
  if (existingUser) {
    const message = `${existingUser.email === email ? "User" : "User name"} already exist.`;
    throw new Error(message);
  }
};

const handleUserCredentialsAndReturn = async (
  user: z.infer<typeof SignUpSchema>,
  session: mongoose.ClientSession,
) => {
  const { password, username, email, name } = user;

  const hashedPassword = await bcrypt.hash(
    password,
    ENV_CONFIG.BCRYPT_HASH_NUMBER,
  );
  user.password = hashedPassword;

  const [newUser] = (await User.create([{ username, email, name }], {
    session,
  })) as UserModelIF[];

  await Account.create(
    [
      {
        userId: newUser.id,
        name,
        provider: "credentials",
        providerAccountId: email,
        password: hashedPassword,
      },
    ],
    { session },
  );

  return newUser;
};
