import { Document } from 'mongoose';

import { IAnswer } from '@/database/answer.model';
import { ICollection } from '@/database/collection.model';
import { IInteraction } from '@/database/interaction.model';
import { IQuestion } from '@/database/question.model';
import { ITagQuestion } from '@/database/tag-question.model';
import { ITag } from '@/database/tag.model';
import { IUser } from '@/database/user.model';
import { IVote } from '@/database/vote.model';

interface AccountModelIF extends IAccount, Document {
  id: string;
}

interface AnswerModelIF extends IAnswer, Document {
  id: string;
}

interface CollectionModelIF extends ICollection, Document {
  id: string;
}

interface InteractionIF extends IInteraction, Document {
  id: string;
}

interface TagModelIF extends ITag, Document {
  id: string;
}

interface QuestionModelIF extends IQuestion, Document {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TagModelIF[];
}

interface TagQuestionModelIF extends ITagQuestion, Document {
  id: string;
}

interface UserModelIF extends IUser, Document {
  id: string;
}

interface VoteModelIF extends IVote, Document {
  id: string;
}
