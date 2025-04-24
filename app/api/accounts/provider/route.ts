import { NextRequest } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations";
// POST /api/accounts/provider
export async function POST(request: NextRequest) {
  try {
    const { providerAccountId } = await request.json();
    await dbConnect();

    const validatedData = AccountSchemaAPI.partial().safeParse({
      providerAccountId,
    });

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");

    return handleSuccess({ data: account });
  } catch (error) {
    return handleError({ error });
  }
}
