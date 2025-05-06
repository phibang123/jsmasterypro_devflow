import { NextRequest } from 'next/server';

import Question from '@/database/question.model';
import Tag from '@/database/tag.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import { NotFoundError } from '@/lib/http.errors';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { getPaginationParams } from '@/lib/utils';

export async function GET(request: NextRequest, { params }: RouteParams) {
  logger.info('Fetching tags');
  const { skip, limit, query, sort } = getPaginationParams(new URL(request.url).searchParams);
  const { id } = await params;
  if (!id) throw new NotFoundError('Tag');
  let queryRegex = {};
  if (query) {
    queryRegex = {
      $or: [{ title: { $regex: new RegExp(`^${query}$`, 'i') } }],
    };
  }
  try {
    await dbConnect();

    const tag = await Tag.findById(id);
    if (!tag) throw new NotFoundError('Tag');
    const questions = await Question.find({ tags: tag._id, ...queryRegex })
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('tags', 'name')
      .populate('author', 'name image');
    const total = await Question.countDocuments({ tags: tag._id, ...queryRegex });
    logger.info(`Questions fetched successfully: ${total}`);
    return handleSuccess({
      data: {
        questions,
        total,
        isNext: total > skip + questions.length,
      },
      message: 'Questions fetched successfully',
    });
  } catch (error) {
    logger.error('Error fetching questions');
    return handleError({ error });
  }
}
