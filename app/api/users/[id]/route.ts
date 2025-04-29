import User from '@/database/user.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import { NotFoundError } from '@/lib/http.errors';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { UserSchemaAPI } from '@/lib/validations';

// GET /api/users/id
export async function GET(_: Request, { params }: RouteParams) {
  logger.info('Getting user');
  try {
    const { id } = await params;
    if (!id) throw new NotFoundError('User');
    await dbConnect();

    const user = await User.findById(id);
    if (!user) throw new NotFoundError('User');
    logger.info('User found');
    return handleSuccess({ data: user });
  } catch (error) {
    logger.error('Error getting user');
    return handleError({ error });
  }
}

// DELETE /api/users/id
export async function DELETE(_: Request, { params }: RouteParams) {
  logger.info('Deleting user');
  try {
    const { id } = await params;
    if (!id) throw new NotFoundError('User');
    await dbConnect();

    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError('User');
    logger.info('User deleted');
    return handleSuccess({ data: user, status: 204 });
  } catch (error) {
    logger.error('Error deleting user');
    return handleError({ error });
  }
}

// PUT /api/users/id
export async function PUT(request: Request, { params }: RouteParams) {
  logger.info('Updating user');
  try {
    const { id } = await params;
    if (!id) throw new NotFoundError('User');
    await dbConnect();

    const body = await request.json();
    const validatedData = UserSchemaAPI.partial().parse(body);

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) throw new NotFoundError('User');
    logger.info('User updated');
    return handleSuccess({ data: updatedUser });
  } catch (error) {
    logger.error('Error updating user');
    return handleError({ error });
  }
}
