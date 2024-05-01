import mongoose from 'mongoose';

export interface DealDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  worker: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  userTitle: string;
  userDescription: string;
  workerTitle: string;
  workerDescription: string;
  status: DealStatus;
  _finishedAt: Date;
  _deletedAt : Date;
}

export enum DealStatus {
  FinishRequestSent = 'FinishRequestSent',
  OnGoing = 'OnGoing',
  Finished = 'Finished',
}

const DealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'an Deal must be associated with an user'],
    },
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
      required: [true, 'an Deal must be associated with a worker'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'an Deal must be associated with a post'],
    },
    userTitle: String,
    userDescription: String,
    workerTitle: String,
    workerDescription: String,
    status: {
      type: String,
      enum: DealStatus,
      default: DealStatus.OnGoing,
    },
    _finishedAt: {
      type: Date,
      default: null,
    },
    _deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Deal = mongoose.model<DealDoc>('Deal', DealSchema);
