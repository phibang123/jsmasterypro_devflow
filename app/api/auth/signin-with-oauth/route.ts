import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import slugify from "slugify";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import { SignInWithOAuthSchemaAPI } from "@/lib/validations";
import { UserModelIF } from "@/types/model";

interface IUserFromLogin {
  name: string;
  username: string;
  email: string;
  image?: string | undefined;
}

export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();
    logger.info("Starting OAuth sign-in process");

    // Validate data
    const validatedData = await validateDataFromSignIn(request);
    logger.info(`Validated OAuth data for provider: ${validatedData.provider}`);

    session.startTransaction();
    // Sanitize username and prepare user info
    const validatedUser = {
      ...validatedData.user,
      username: slugifyData(validatedData.user.username),
    };
    logger.info(`Prepared user data with username: ${validatedUser.username}`);

    // Create or update user
    const existingUser = await createUserOrUpdateIfUserExist(
      validatedUser,
      session,
    );
    logger.info(`User operation completed for: ${existingUser._id}`);

    // Create account if it doesn't exist
    await createAccountIfAccountDoesNotExist(
      existingUser,
      session,
      validatedData,
    );
    logger.info(`Account operation completed for user: ${existingUser._id}`);

    await session.commitTransaction();
    logger.info(`OAuth sign-in successful for user: ${existingUser._id}`);

    return handleSuccess({
      data: existingUser,
      message: `login in by ${validatedData.provider} is successful`,
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    logger.error("OAuth sign-in failed:", error);
    return handleError({ error }) as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateDataFromSignIn = async (request: Request) => {
  try {
    const dataRequest = await request.json();
    const validatedData = SignInWithOAuthSchemaAPI.safeParse(dataRequest);

    if (!validatedData.success) {
      logger.error(
        "OAuth validation failed:",
        validatedData.error.flatten().fieldErrors,
      );
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    return validatedData.data;
  } catch (error) {
    logger.error("OAuth data validation error:", error);
    throw error;
  }
};

const slugifyData = (data: string) => {
  return slugify(data, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const createUserOrUpdateIfUserExist = async (
  user: IUserFromLogin,
  session: mongoose.ClientSession,
): Promise<UserModelIF> => {
  const { name, username, email, image } = user;

  let existingUser = await User.findOne({ email }).session(session);

  if (!existingUser) {
    logger.info(`Creating new user with email: ${email}`);
    [existingUser] = await User.create([{ name, username, email, image }], {
      session,
    });
  } else {
    const updateData: Partial<IUserFromLogin> = {};

    if (existingUser.name !== name) updateData.name = name;
    if (existingUser.image !== image) updateData.image = image;

    if (Object.keys(updateData).length > 0) {
      logger.info(`Updating existing user: ${existingUser._id}`);
      await User.updateOne(
        { _id: existingUser._id },
        { $set: updateData },
      ).session(session);
    }
  }
  return existingUser;
};

const createAccountIfAccountDoesNotExist = async (
  existingUser: UserModelIF,
  session: mongoose.ClientSession,
  validatedData: z.infer<typeof SignInWithOAuthSchemaAPI>,
) => {
  const {
    provider,
    providerAccountId,
    user: { name, image },
  } = validatedData;

  const existingAccount = await Account.findOne({
    userId: existingUser._id,
    provider,
    providerAccountId,
  }).session(session);

  if (!existingAccount) {
    logger.info(
      `Creating new account for user: ${existingUser._id}, provider: ${provider}`,
    );
    await Account.create(
      [{ name, userId: existingUser._id, image, provider, providerAccountId }],
      { session },
    );
  }
};
