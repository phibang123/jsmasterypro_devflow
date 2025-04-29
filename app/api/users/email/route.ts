import User from '@/database/user.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import { NotFoundError, ValidationError } from '@/lib/http.errors';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { UserSchemaAPI } from '@/lib/validations';

// POST /api/users/email
export async function POST(request: Request) {
  logger.info('Getting user by email');
  try {
    await dbConnect();
    const { email } = await request.json();
    const validatedData = UserSchemaAPI.partial().safeParse({ email });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }
    const user = await User.findOne({ email });
    if (!user) throw new NotFoundError('User');
    logger.info('User found');
    return handleSuccess({ data: user });
  } catch (error) {
    logger.error('Error getting user by email');
    return handleError({ error });
  }
}
