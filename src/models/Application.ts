import { NextFunction } from 'express';
import mongoose from 'mongoose';

export interface ApplicationDoc extends mongoose.Document {
  worker: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
  _deletedAt : Date;
  _createdAt : Date;
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
    price: Number,
    _deletedAt: {
      type: Date,
      default: null, //TODO : check default and add validator 
    },
  },
  
  {
    timestamps: true,
  }
);


ApplicationSchema.pre(/^find/, function (next) {
  // Filter out documents with _deletedAt set (including non-null values)
  ( this as any).where({ _deletedAt: { $exists: false } });
  next();
});

ApplicationSchema.pre(/^find/, function <ApplicationDoc> (next: NextFunction) {
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
