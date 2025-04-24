import mongoose from "mongoose";
import slugify from "slugify";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { SignInWithOAuthSchemaAPI } from "@/lib/validations";
import { UserModelIF } from "@/types/model";

// Step to signin with oauth
// 1. Validate request
// 2. Sanitize username and prepare user info
// 3. Create or update user
// 4. Create account if it doesn't exist
// 5. Commit transaction
export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    logger.info("Starting OAuth sign-in process");

    const [validatedData] = await Promise.all([
      validateRequest(request, SignInWithOAuthSchemaAPI),
      dbConnect(),
    ]);

    session.startTransaction();
    const validatedUser = {
      ...validatedData.user,
      username: slugifyData(validatedData.user.username),
    };

    const existingUser = await createUserOrUpdateIfUserExist(
      validatedUser,
      session,
    );

    await createAccountIfAccountDoesNotExist(
      existingUser,
      session,
      validatedData,
    );

    await session.commitTransaction();
    logger.info("OAuth sign-in successful");
    return handleSuccess({
      data: existingUser,
      message: `login in by ${validatedData.provider} is successful`,
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    logger.error("OAuth sign-in failed:", error);
    return handleError({ error }) as APIErrorResponse;
  } finally {
    await session.endSession();
  }
}

const slugifyData = (data: string) => {
  return slugify(data, {
    lower: true,
    strict: true,
    trim: true,
  });
};

const createUserOrUpdateIfUserExist = async (
  user: IUserFromLoginOAuth,
  session: mongoose.ClientSession,
): Promise<UserModelIF> => {
  const { name, username, email, image } = user;

  let existingUser = await User.findOne({ email }).session(session);
  console.log(existingUser, "existingUser");

  if (!existingUser) {
    [existingUser] = await User.create([{ name, username, email, image }], {
      session,
    });
  } else {
    const updateData: Partial<IUserFromLoginOAuth> = {};

    if (existingUser.name !== name) updateData.name = name;
    if (existingUser.image !== image) updateData.image = image;

    if (Object.keys(updateData).length > 0) {
      await User.updateOne(
        { _id: existingUser.id },
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
    userId: existingUser.id,
    provider,
    providerAccountId,
  }).session(session);

  if (!existingAccount) {
    await Account.create(
      [{ name, userId: existingUser.id, image, provider, providerAccountId }],
      { session },
    );
  }
};
