import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";

// GET /api/users/id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User");

    return handleSuccess(user);
  } catch (error) {
    return handleError({ error });
  }
}

// DELETE /api/users/id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return handleSuccess(user, 204);
  } catch (error) {
    return handleError({ error });
  }
}

// PUT /api/users/id
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchema.partial().parse(body); // User partial for all key is optional, if it err, throw Error

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) throw new NotFoundError("User");
    return handleSuccess(updatedUser);
  } catch (error) {
    return handleError({ error });
  }
}
