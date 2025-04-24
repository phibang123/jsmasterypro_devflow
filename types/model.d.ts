import { Document } from "mongoose";

import { IAnswer } from "@/database/answer.model";
import { ICollection } from "@/database/collection.model";
import { IInteraction } from "@/database/interaction.model";
import { IQuestion } from "@/database/question.model";
import { ITagQuestion } from "@/database/tag-question.model";
import { ITag } from "@/database/tag.model";
import { IUser } from "@/database/user.model";
import { IVote } from "@/database/vote.model";

interface AccountModelIF extends IAccount, Document {
  _id: string;
}

interface AnswerModelIF extends IAnswer, Document {
  _id: string;
}

interface CollectionModelIF extends ICollection, Document {
  _id: string;
}

interface InteractionIF extends IInteraction, Document {
  _id: string;
}

interface TagModelIF extends ITag, Document {
  _id: string;
}

interface QuestionModelIF extends IQuestion, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  tags: TagModelIF[];
}

interface TagQuestionModelIF extends ITagQuestion, Document {
  _id: string;
}

interface UserModelIF extends IUser, Document {
  _id: string;
}

interface VoteModelIF extends IVote, Document {
  _id: string;
}
