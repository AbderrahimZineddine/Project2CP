import { NextFunction } from 'express';
import mongoose from 'mongoose';
import { Worker } from './Worker';
import AppError from '../utils/appError';
import { WorkerDoc } from './WorkerDoc';

export interface ReviewDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  worker: mongoose.Schema.Types.ObjectId;
  review: string;
  rating: number;
}

const ReviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'A review must be associated with an user'],
  },
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Worker',
    required: [true, 'A review must be associated with a worker'],
  },
  review: String,
  rating: {
    type: Number,
    required: [true, 'A review must have a rating'],
    min: [0, 'Rating cannot be below 0'],
    max: [5, 'Rating must be below or equal to 5'],
  },
  _deletedAt: {
    type: Date,
    default: null,
  },
});

ReviewSchema.pre(/^find/, function (next) {
  const query = (this as any).getQuery();

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

ReviewSchema.pre('save', async function (next: NextFunction) {
  if (this.isNew) {
    const worker: WorkerDoc = await Worker.findById(this.worker);
    if (!this.worker) {
      return next(
        new AppError('There is no worker with id ' + this.worker, 400)
      );
    }
    worker.ratingsNumber++;
    worker.rating = (this.rating + worker.rating) / worker.ratingsNumber; //or here ++worker.ratingsNumber
    await worker.save({ validateModifiedOnly: true });
  }
  next();
  //   } else if (!this.isModified('rating')) {
  //     const worker: WorkerDoc = await Worker.findById(this.worker);
  //     if (!this.worker) {
  //       return next(
  //         new AppError('There is no worker with id ' + this.worker, 400)
  //       );
  //     }

  //     worker.rating = (this.rating + worker.rating) / worker.ratingsNumber;
  //     await worker.save();

  //   }
});

export const Review = mongoose.model<ReviewDoc>('Review', ReviewSchema);
