import mongoose from 'mongoose';
import { NextRequest } from 'next/server';
import { z } from 'zod';

import Question from '@/database/question.model';
import TagQuestion from '@/database/tag-question.model';
import Tag from '@/database/tag.model';
import '@/database/user.model';
import handleError from '@/lib/handlers/error.handler';
import handleSuccess from '@/lib/handlers/success.handler';
import logger from '@/lib/logger';
import dbConnect from '@/lib/mongoose';
import { getPaginationParams, validateDuplicateTags, validateRequest } from '@/lib/utils';
import { CreateQuestionRequestSchemaAPI } from '@/lib/validations';

// Types
type QuestionData = Omit<z.infer<typeof CreateQuestionRequestSchemaAPI>, 'tags'>;

const createOrUpdateTags = async (tags: string[], session: mongoose.ClientSession) => {
  try {
    const tagOperations = tags.map((tag) => ({
      updateOne: {
        filter: { name: { $regex: new RegExp(`^${tag}$`, 'i') } },
        update: { $inc: { questions: 1 }, $setOnInsert: { name: tag } },
        upsert: true,
      },
    }));

    await Tag.bulkWrite(tagOperations, { session });

    return Tag.find(
      { name: { $in: tags.map((tag) => new RegExp(`^${tag}$`, 'i')) } },
      { _id: 1 },
      { session },
    ).distinct('_id');
  } catch (error) {
    logger.error('Error creating/updating tags:', error);
    throw error;
  }
};

const createQuestionAndTagRelations = async (
  tagIds: string[],
  { userId, title, description, content }: QuestionData,
  session: mongoose.ClientSession,
) => {
  try {
    const [question] = await Question.create(
      [{ author: userId, title, description, content, tags: tagIds }],
      { session },
    );

    await TagQuestion.create(
      tagIds.map((tagId) => ({ question: question.id, tagId })),
      { session, ordered: true },
    );

    return question.id;
  } catch (error) {
    logger.error('Error creating question and tag relations:', error);
    throw error;
  }
};

// POST /api/questions
export async function POST(request: NextRequest) {
  logger.info('Creating question');
  let validatedData: z.infer<typeof CreateQuestionRequestSchemaAPI>;
  try {
    const body = await request.json();
    validatedData = validateRequest(body, CreateQuestionRequestSchemaAPI, {
      requiredAuth: true,
    });

    validateDuplicateTags(validatedData.tags);
  } catch (error) {
    return handleError({ error });
  }

  const session = await mongoose.startSession();

  try {
    await dbConnect();

    session.startTransaction();

    const { tags, ...questionData } = validatedData;
    const tagIds = await createOrUpdateTags(tags, session);
    const questionId = await createQuestionAndTagRelations(tagIds, questionData, session);

    await session.commitTransaction();
    logger.info(`Question created successfully: ${questionId}`);

    return handleSuccess({
      message: 'Question created successfully',
      data: { id: questionId },
    });
  } catch (error) {
    await session?.abortTransaction();
    logger.error('Error creating question:', error);
    return handleError({ error });
  } finally {
    await session?.endSession();
  }
}

// GET /api/questions
export async function GET(request: NextRequest) {
  logger.info('Fetching questions');
  const { skip, limit, query, sort, filter } = getPaginationParams(
    new URL(request.url).searchParams,
  );
  let sortDefinition = sort;
  let queryRegex = {};
  if (query) {
    queryRegex = {
      $or: [
        { title: { $regex: new RegExp(`^${query}$`, 'i') } },
        { description: { $regex: new RegExp(`^${query}$`, 'i') } },
        { content: { $regex: new RegExp(`^${query}$`, 'i') } },
      ],
    };
  }

  if (filter) {
    if (filter === 'recommendation') {
      return handleSuccess({
        data: {
          questions: [],
          total: 0,
          isNext: false,
        },
      });
      // try {
      //   await dbConnect();
      //   // Get all questions with their metrics
      //   const questions = await Question.find({})
      //     .populate("author", "name image")
      //     .populate("tags", "name");
      //   // Calculate recommendation score for each question
      //   const recommendedQuestions = questions.map((question) => {
      //     const now = new Date();
      //     const createdAt = new Date(question.createdAt);
      //     const timeDiff = now.getTime() - createdAt.getTime();
      //     const daysOld = timeDiff / (1000 * 60 * 60 * 24);
      //     // Calculate score based on multiple factors
      //     const score =
      //       question.votes * 0.3 + // 30% weight for votes
      //       question.views * 0.2 + // 20% weight for views
      //       question.answers.length * 0.2 + // 20% weight for answers
      //       question.tags.length * 0.1 + // 10% weight for tag count
      //       (1 / (1 + daysOld)) * 0.2; // 20% weight for recency (decaying factor)
      //     return {
      //       ...question.toObject(),
      //       recommendationScore: score,
      //     };
      //   });
      //   // Sort by recommendation score and get top questions
      //   const sortedQuestions = recommendedQuestions
      //     .sort((a, b) => b.recommendationScore - a.recommendationScore)
      //     .slice(skip, skip + limit);
      //   return handleSuccess({
      //     data: {
      //       questions: sortedQuestions,
      //       total: recommendedQuestions.length,
      //       isNext: recommendedQuestions.length > skip + limit,
      //     },
      //     message: "Recommended questions fetched successfully",
      //   });
      // } catch (error) {
      //   logger.error("Error fetching recommended questions:", error);
      //   return handleError({ error });
      // }
    }
    switch (filter) {
      case 'newest':
        sortDefinition = 'createdAt';
        break;
      case 'oldest':
        sortDefinition = '-createdAt';
        break;
      case 'most-votes':
        sortDefinition = 'votes';
        break;
      case 'least-votes':
        sortDefinition = '-votes';
        break;
      case 'most-answers':
        sortDefinition = 'answers';
        break;
      case 'least-answers':
        sortDefinition = '-answers';
        break;
      case 'most-views':
        sortDefinition = 'views';
        break;
      case 'least-views':
        sortDefinition = '-views';
        break;
      case 'most-comments':
        sortDefinition = 'comments';
        break;
      case 'least-comments':
        sortDefinition = '-comments';
        break;
      default:
        sortDefinition = '-createdAt';
        break;
    }
  }
  try {
    await dbConnect();

    const questions = await Question.find(queryRegex)
      .populate('author', 'name image')
      .populate('tags', 'name')
      .sort({ [sortDefinition]: -1 })
      .skip(skip)
      .limit(limit);
    // .lean(); // ToDo
    const total = await Question.countDocuments(queryRegex);
    logger.info(`Questions fetched successfully: ${total}`);
    return handleSuccess({
      data: {
        // questions: questions.map((question) => transformLeanDocument(question)), // ToDo
        questions,
        total,
        isNext: total > skip + questions.length,
      },
      message: 'Questions fetched successfully',
    });
  } catch (error) {
    logger.error('Error fetching questions:', error);
    return handleError({ error });
  }
}
