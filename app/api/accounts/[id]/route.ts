import { NextRequest } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { AccountSchemaAPI } from "@/lib/validations";

// GET /api/accounts/id
export async function GET(_: NextRequest, context: RouteParams) {
  logger.info("Fetching account");
  try {
    const { id } = await context.params;
    if (!id) throw new NotFoundError("Account");
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");
    logger.info("Account fetched successfully");
    return handleSuccess({ data: account });
  } catch (error) {
    logger.error("Error fetching account");
    return handleError({ error });
  }
}

// DELETE /api/account/id
export async function DELETE(_: NextRequest, context: RouteParams) {
  logger.info("Deleting account");
  try {
    const { id } = await context.params;
    if (!id) throw new NotFoundError("Account");
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");
    logger.info("Account deleted successfully");
    return handleSuccess({ data: account, status: 204 });
  } catch (error) {
    logger.error("Error deleting account");
    return handleError({ error });
  }
}

// PUT /api/accounts/id
export async function PUT(request: NextRequest, context: RouteParams) {
  logger.info("Updating account");

  try {
    const { id: idParam } = await context.params;
    if (!idParam) throw new NotFoundError("Account");
    const body = await request.json();
    const validatedData = validateRequest(body, AccountSchemaAPI, {
      partial: true,
    });
    await dbConnect();

    const updatedAccount = await Account.findByIdAndUpdate(
      idParam,
      validatedData,
      {
        new: true,
      },
    );

    if (!updatedAccount) throw new NotFoundError("Account");
    logger.info("Account updated successfully");
    return handleSuccess({ data: updatedAccount });
  } catch (error) {
    logger.error("Error updating account");
    return handleError({ error });
  }
}
