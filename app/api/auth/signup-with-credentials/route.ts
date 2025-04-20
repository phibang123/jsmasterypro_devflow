import dbConnect from "@/lib/mongoose";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import { SignUpSchema } from "@/lib/validations/index";
import { UserModelIF } from "@/types/model";

const bcryptHashNumber = 10;

export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();
    logger.info("Starting credentials sign-up process");

    // Validate data
    const validatedData = await validateDataFromSignUp(request);
    const { email, username } = validatedData;
    logger.info(`Validated sign-up data for user: ${email}`);

    session.startTransaction();
    // Check user exist
    await throwErrorIfUserExist(email, username, session);
    logger.info(`User validation passed for: ${email}`);

    // Create user and account
    const newUser = await handleUserCredentialsAndReturn(
      validatedData,
      session,
    );
    logger.info(`Created new user with ID: ${newUser._id}`);

    // Commit
    await session.commitTransaction();
    logger.info(`Sign-up successful for user: ${newUser._id}`);

    const { id, image, name } = newUser;
    return handleSuccess({
      data: { id, email, image, name },
      message: "Sign up by credentials successful",
      status: 201,
    });
  } catch (error) {
    session.abortTransaction();
    logger.error("Sign-up process failed:", error);
    return handleError({ error }) as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateDataFromSignUp = async (request: Request) => {
  try {
    const { name, username, email, password } = await request.json();
    logger.info(`Attempting to validate sign-up data for: ${email}`);

    const validatedData = SignUpSchema.safeParse({
      name,
      username,
      email,
      password,
    });
    if (!validatedData.success) {
      logger.error(
        "Sign-up validation failed:",
        validatedData.error.flatten().fieldErrors,
      );
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    return validatedData.data;
  } catch (error) {
    logger.error("Error in sign-up data validation:", error);
    throw error;
  }
};

const throwErrorIfUserExist = async (
  email: string,
  username: string,
  session: mongoose.ClientSession,
) => {
  logger.info(`Checking if user exists: ${email} or username: ${username}`);
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  }).session(session);
  if (existingUser) {
    const message = `${existingUser.email === email ? "User" : "User name"} already exist.`;
    logger.warn(`User existence check failed: ${message}`);
    throw new Error(message);
  }
  logger.info("User existence check passed");
};

const handleUserCredentialsAndReturn = async (
  user: z.infer<typeof SignUpSchema>,
  session: mongoose.ClientSession,
) => {
  const { password, username, email, name } = user;
  logger.info(`Processing credentials for user: ${email}`);

  const hashedPassword = await bcrypt.hash(password, bcryptHashNumber);
  user.password = hashedPassword;

  logger.info(`Creating new user record for: ${email}`);
  const [newUser] = (await User.create([{ username, email, name }], {
    session,
  })) as UserModelIF[];

  logger.info(`Creating account record for user: ${newUser._id}`);
  await Account.create(
    [
      {
        userId: newUser._id,
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
