import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations/api-route.validation";

// GET /api/accounts/id
export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");
  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");

    return handleSuccess({ data: account });
  } catch (error) {
    return handleError({ error });
  }
}

// DELETE /api/account/id
export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");
  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return handleSuccess({ data: account, status: 204 });
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
  if (!id) throw new NotFoundError("Account");
  try {
    await dbConnect();

    const body = await request.json();
    const validatedData = AccountSchemaAPI.partial().safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) throw new NotFoundError("Account");
    return handleSuccess({ data: updatedAccount });
  } catch (error) {
    return handleError({ error });
  }
}
