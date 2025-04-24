import { NextRequest } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations";

type RouteParams = {
  params: Promise<{ id: string }>;
};

// GET /api/accounts/id
export async function GET(_: NextRequest, context: RouteParams) {
  const { id } = await context.params;
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
export async function DELETE(_: NextRequest, context: RouteParams) {
  const { id } = await context.params;
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
export async function PUT(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
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
