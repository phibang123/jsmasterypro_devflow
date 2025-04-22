import { Document } from "mongoose";

import { IAnswer } from "@/database/answer.model";
import { ICollection } from "@/database/collection.model";
import { IInteraction } from "@/database/interaction.model";
import { ITagQuestion } from "@/database/tag-question.model";
import { ITag } from "@/database/tag.model";
import { IUser } from "@/database/user.model";
import { IVote } from "@/database/vote.model";
import { IQuestion } from "@/database/question.model";

interface AccountModelIF extends IAccount, Document {}

interface AnswerModelIF extends IAnswer, Document {}

interface CollectionModelIF extends ICollection, Document {}

interface InteractionIF extends IInteraction, Document {}

interface QuestionModelIF extends IQuestion, Document {
  createdAt: Date;
  updatedAt: Date;
  tags: ITag[];
  id: string;
}

interface TagQuestionModelIF extends ITagQuestion, Document {}

interface TagModelIF extends ITag, Document {}

interface UserModelIF extends IUser, Document {}

interface VoteModelIF extends IVote, Document {}
