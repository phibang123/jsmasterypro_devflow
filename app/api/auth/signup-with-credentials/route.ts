import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { z } from "zod";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { SignUpSchema } from "@/lib/validations";
import { UserModelIF } from "@/types/model";

const bcryptHashNumber = 10;

export async function POST(request: Request) {
  const session = await mongoose.startSession();

  try {
    await dbConnect();
    // Validate data
    const validatedData = await validateDataFromSignUp(request);
    const { email, username } = validatedData;

    session.startTransaction();
    // Check user exist
    await throwErrorIfUserExist(email, username, session);
    // Create user and account
    const newUser = await handleUserCredentialsAndReturn(
      validatedData,
      session,
    );

    // Commit
    await session.commitTransaction();

    const { id, image, name } = newUser;
    return handleSuccess({
      data: { id, email, image, name },
      message: "Sign up by credentials successful",
      status: 201,
    });
  } catch (error) {
    session.abortTransaction();
    return handleError({ error }) as APIErrorResponse;
  } finally {
    session.endSession();
  }
}

const validateDataFromSignUp = async (request: Request) => {
  const { name, username, email, password } = await request.json();

  const validatedData = SignUpSchema.safeParse({
    name,
    username,
    email,
    password,
  });
  if (!validatedData.success) {
    throw new ValidationError(validatedData.error.flatten().fieldErrors);
  }
  return validatedData.data;
};

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
  const hashedPassword = await bcrypt.hash(password, bcryptHashNumber);
  user.password = hashedPassword;
  const [newUser] = (await User.create([{ username, email, name }], {
    session,
  })) as UserModelIF[];
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
