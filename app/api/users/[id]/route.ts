import User from "@/database/user.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { UserSchemaAPI } from "@/lib/validations";

// GET /api/users/id
export async function GET(_: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError("User");

    return handleSuccess({ data: user });
  } catch (error) {
    return handleError({ error });
  }
}

// DELETE /api/users/id
export async function DELETE(_: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return handleSuccess({ data: user, status: 204 });
  } catch (error) {
    return handleError({ error });
  }
}

// PUT /api/users/id
export async function PUT(request: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!id) throw new NotFoundError("User");
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchemaAPI.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) throw new NotFoundError("User");
    return handleSuccess({ data: updatedUser });
  } catch (error) {
    return handleError({ error });
  }
}
