import mongoose from "mongoose";
import slugify from "slugify";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";
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

    // Validate data
    const validatedData = await validateDataFromSignIn(request);

    session.startTransaction();
    // Sanitize username and prepare user info
    const validatedUser = {
      ...validatedData.user,
      username: slugifyData(validatedData.user.username),
    };

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
    return handleSuccess({
      data: existingUser,
      message: `login in by ${validatedData.provider} is successful`,
    });
  } catch (error: unknown) {
    await session.abortTransaction();
    return handleError({ error }) as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateDataFromSignIn = async (request: Request) => {
  const dataRequest = await request.json();

  const validatedData = SignInWithOAuthSchema.safeParse(dataRequest);
  if (!validatedData.success) {
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  }
  return validatedData.data;
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
    [existingUser] = await User.create([{ name, username, email, image }], {
      session,
    });
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
  validatedData: z.infer<typeof SignInWithOAuthSchema>,
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
      [{ name, userId: existingUser._id, image, provider, providerAccountId }], // if you use session transition/ must insert by arr
      { session },
    );
  }
};
