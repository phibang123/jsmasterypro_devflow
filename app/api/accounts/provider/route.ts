import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error.handler";
import handleSuccess from "@/lib/handlers/success.handler";
import { NotFoundError, ValidationError } from "@/lib/http.errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchemaAPI } from "@/lib/validations/api-route.validation";

// POST /api/users/email
export async function POST(request: Request) {
  const { providerAccountId } = await request.json();
  try {
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
