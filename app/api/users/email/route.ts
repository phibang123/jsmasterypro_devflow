import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/response";

// POST /api/users/email
export async function POST(request: Request) {
  const { email } = await request.json();
  try {
    const validatedData = UserSchema.partial().safeParse({ email });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ data: user, success: true }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
