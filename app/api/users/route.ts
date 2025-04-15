import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// GET /api/users
export async function GET() {
  try {
    await dbConnect();

    const users = await User.find();

    return handleSuccess(users);
  } catch (error) {
    return handleError({ error });
  }
}

// POST /api/users
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error(
        `${existingUser.username === username ? "User" : "Username"} already exist`,
      );
    }

    const newUser = await User.create(validatedData.data);
    return handleSuccess(newUser, 201);
  } catch (error) {
    return handleError({ error });
  }
}
