import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ForbiddenError } from "@/lib/http.errors";
import logger from "@/lib/logger";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations";

// GET /api/accounts
export async function GET() {
  logger.info("Fetching accounts");
  try {
    await dbConnect();

    const accounts = await Account.find();
    logger.info("Accounts fetched successfully");
    return handleSuccess({ data: accounts });
  } catch (error) {
    logger.error("Error fetching accounts");
    return handleError({ error });
  }
}

// POST /api/accounts
export async function POST(request: Request) {
  logger.info("Creating account");
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = AccountSchemaAPI.parse(body);

    const { provider, providerAccountId } = validatedData;

    const existingAccount = await Account.findOne({
      $and: [{ provider }, { providerAccountId }],
    });

    if (existingAccount) {
      throw new ForbiddenError(
        "An account with the same provider and already exit",
      );
    }

    const newAccount = await Account.create(validatedData);
    logger.info("Account created successfully");
    return handleSuccess({ data: newAccount, status: 201 });
  } catch (error) {
    logger.error("Error creating account");
    return handleError({ error });
  }
}
