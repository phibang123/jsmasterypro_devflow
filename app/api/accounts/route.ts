import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { ForbiddenError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations";

// GET /api/accounts
export async function GET() {
  try {
    await dbConnect();

    const accounts = await Account.find();

    return handleSuccess({ data: accounts });
  } catch (error) {
    return handleError({ error });
  }
}

// POST /api/accounts
export async function POST(request: Request) {
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
    return handleSuccess({ data: newAccount, status: 201 });
  } catch (error) {
    return handleError({ error });
  }
}
