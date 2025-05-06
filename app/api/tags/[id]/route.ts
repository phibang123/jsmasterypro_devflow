import { NextRequest } from 'next/server';

import Tag from '@/database/tag.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import { NotFoundError } from '@/lib/http.errors';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';

export async function GET(_: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  if (!id) throw new NotFoundError('Tag');
  try {
    await dbConnect();
    const tag = await Tag.findById(id);
    if (!tag) throw new NotFoundError('Tag');
    return handleSuccess({
      data: tag,
      message: 'Tag fetched successfully',
    });
  } catch (error) {
    logger.error('Error fetching tag');
    return handleError({ error });
  }
}
