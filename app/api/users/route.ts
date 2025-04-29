import { NextRequest } from 'next/server';

import User from '@/database/user.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import { ValidationError } from '@/lib/http.errors';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { UserSchemaAPI } from '@/lib/validations';

// GET /api/users
export async function GET() {
  logger.info('Getting users');
  try {
    await dbConnect();

    const users = await User.find();
    logger.info('Users fetched');
    return handleSuccess({ data: users });
  } catch (error) {
    logger.error('Error getting users');
    return handleError({ error });
  }
}

// POST /api/users
export async function POST(request: NextRequest) {
  logger.info('Creating user');
  try {
    await dbConnect();
    const body = await request.json();

    const validatedData = UserSchemaAPI.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username } = validatedData.data;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      throw new Error(`${existingUser.username === username ? 'User' : 'Username'} already exist`);
    }

    const newUser = await User.create(validatedData.data);
    logger.info('User created');
    return handleSuccess({ data: newUser, status: 201 });
  } catch (error) {
    logger.error('Error creating user');
    return handleError({ error });
  }
}
