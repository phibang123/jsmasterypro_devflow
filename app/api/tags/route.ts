import { NextRequest } from 'next/server';

import Tag from '@/database/tag.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: NextRequest) {
  logger.info('Fetching tags');
  const { skip, limit, query, sort, filter } = getPaginationParams(
    new URL(request.url).searchParams,
  );
  let queryRegex = {};
  let sortDefinition = sort;

  if (query) {
    queryRegex = {
      $or: [{ name: { $regex: new RegExp(`^${query}$`, 'i') } }],
    };
  }

  switch (filter) {
    case 'popular':
      sortDefinition = '-questions';
      break;
    case 'least-questions':
      sortDefinition = 'questions';
      break;
    case 'name':
      sortDefinition = 'name';
      break;
    case 'recent':
      sortDefinition = '-createdAt';
      break;
    case 'newest':
      sortDefinition = '-createdAt';
      break;
    case 'oldest':
      sortDefinition = 'createdAt';
      break;
    default:
      sortDefinition = '-createdAt';
      break;
  }

  try {
    await dbConnect();

    const tags = await Tag.find(queryRegex).sort(sortDefinition).skip(skip).limit(limit);
    const total = await Tag.countDocuments(queryRegex);
    logger.info(`Tags fetched successfully: ${total}`);
    return handleSuccess({
      data: { tags, total, isNext: total > skip + tags.length },
      message: 'Tags fetched successfully',
    });
  } catch (error) {
    logger.error('Error fetching tags', error);
    return handleError({ error });
  }
}
