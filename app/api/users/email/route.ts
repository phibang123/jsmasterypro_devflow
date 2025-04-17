import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { UserSchemaAPI } from "@/lib/validations";

// POST /api/users/email
export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    await dbConnect();
    const validatedData = UserSchemaAPI.partial().safeParse({ email });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return handleSuccess({ data: user });
  } catch (error) {
    return handleError({ error });
  }
}
