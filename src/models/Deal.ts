import { NextFunction } from 'express';
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
  statusOrd: number;
  _finishedAt: Date;
  _deletedAt: Date;
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
    statusOrd: {
      type: Number,
      default: 2,
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

DealSchema.pre(/^find/, function (next) {
  const query = (this as any).getQuery();
  console.log(query);
  if (
    query &&
    query['$or'] &&
    query['$or'][2] &&
    query['$or'][2]._includeDeleted === true
  ) {
    delete query['$or'][2]._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
  } else if (query._includeDeleted === true) {
    delete query._includeDeleted; // Remove the flag from the query //TODO shouldn't matter if i keep this commented innit
  } else {
    // Filter out documents with _deletedAt set (including non-null values)
    query._deletedAt = null;
  }
  next();
});

//

DealSchema.pre("find", function <PostDoc>(next: NextFunction) {

  this.populate({
    path: 'user',
    select: 'name profilePicture wilaya', // Select specific fields from the user model
  });
  this.populate({
    path: 'worker',
    select: 'name profilePicture job', // Select specific fields from the user model
  });

  next();
});


export const Deal = mongoose.model<DealDoc>('Deal', DealSchema);
