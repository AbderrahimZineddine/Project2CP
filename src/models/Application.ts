import { NextFunction } from 'express';
import mongoose from 'mongoose';

// export enum ApplicationStatus {
//   // OnHold = "OnHold",
//   Accepted = "Accepted",
//   Finished = 'Finished',
//   Declined = 'Declined',
// }

export interface ApplicationDoc extends mongoose.Document {
  worker: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
  _deletedAt: Date;
  _acceptedAt: Date;
  _createdAt: Date;
  // status: ApplicationStatus;
  // statusUpdatedAt : Date;
}

const ApplicationSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
      required: [true, 'an application must be associated with a worker'],
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: 'Post',
      required: [true, 'an application must be associated with a post'],
    },
    description: {
      type: String,
      required: [true, 'an application must have a description'],
    },
    price: {
      type: Number,
      min: [0, 'Cannot have a price less than 0'],
    },
    _deletedAt: {
      type: Date,
      default: null, //TODO : check default and add validator
    },
    _acceptedAt: {
      type: Date,
      default: null, //TODO : check default and add validator
    },
    // statusUpdatedAt : Date,
    // status: {
    //   type: String,
    //   enum: ApplicationStatus,
    // },
  },

  {
    timestamps: true,
  }
);

// ApplicationSchema.pre(/^find/, function (next) {
//   // Filter out documents with _deletedAt set (including non-null values)
//   (this as any).where({ _deletedAt: null });
//   next();
// });

ApplicationSchema.pre(/^find/, function (next) {
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

ApplicationSchema.pre(/^find/, function <ApplicationDoc>(next: NextFunction) {
  this.populate({
    path: 'worker',
    select: 'name profilePicture job', // Select specific fields from the user model
  });
  next();
});

export const Application = mongoose.model<ApplicationDoc>(
  'Application',
  ApplicationSchema
);
