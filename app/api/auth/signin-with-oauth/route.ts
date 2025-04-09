import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
import { UserModelIF } from "@/types/model";

interface IValidateDataParam {
  provider: unknown;
  providerAccountId: unknown;
  user: unknown;
}

interface IValidatedDataParam {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    username: string;
    email: string;
    image?: string | undefined;
  };
}

interface IUserFromLogin {
  name: string;
  username: string;
  email: string;
  image?: string | undefined;
}

export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();
  const session = await mongoose.startSession();

  try {
    await dbConnect();
    session.startTransaction();

    // Validate data
    const validatedData = validateDataFromSignIn({
      provider,
      providerAccountId,
      user,
    });

    // Sanitize username and prepare user info
    const validatedUser = prepareUserInfo(validatedData.user);

    // Create or update user
    const existingUser = await createUserOrUpdateIfUserExist(
      validatedUser,
      session,
    );

    // Create account if it doesn't exist
    await createAccountIfAccountDoesNotExist(
      existingUser,
      session,
      validatedData,
    );

    await session.commitTransaction();
    return NextResponse.json({ success: true, user: existingUser });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError(error) as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateDataFromSignIn = (data: IValidateDataParam) => {
  const validatedData = SignInWithOAuthSchema.safeParse(data);
  if (!validatedData.success) {
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  }
  return validatedData.data;
};

const prepareUserInfo = (user: IUserFromLogin): IUserFromLogin => {
  return {
    ...user,
    username: slugifyData(user.username), // slugify username when processing
  };
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
    existingUser = await User.create(
      { name, username, email, image },
      { session },
    );
  } else {
    const updateData: Partial<IUserFromLogin> = {};

    if (existingUser.name !== name) updateData.name = name;
    if (existingUser.image !== image) updateData.image = image;

    if (Object.keys(updateData).length > 0) {
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
  validatedData: IValidatedDataParam,
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
    await Account.create(
      { name, userId: existingUser._id, image, provider, providerAccountId },
      { session },
    );
  }
};
