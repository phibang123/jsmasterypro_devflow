import { NextRequest } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { validateRequest } from "@/lib/utils";
import { AccountSchemaAPI } from "@/lib/validations";
// POST /api/accounts/provider
export async function POST(request: NextRequest) {
  logger.info("Creating account");
  try {
    const { providerAccountId } = await request.json();
    await dbConnect();

    validateRequest({ userId: providerAccountId }, AccountSchemaAPI.partial(), {
      partial: true,
    });

    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("Account");
    logger.info("Account created successfully");
    return handleSuccess({ data: account });
  } catch (error) {
    logger.error("Error creating account");
    return handleError({ error });
  }
}
