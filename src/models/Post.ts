import mongoose from 'mongoose';
import { Job } from './WorkerDoc';
import { NextFunction } from 'express';
import { Location } from './WorkerDoc';

export interface PostDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  job: Job;
  images: string[];
  selectedWorkers: mongoose.Schema.Types.ObjectId[];
  price: number;
  hidden: boolean;
  location: Location;
}

const PostSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'a post must be associated with a user'],
    },
    title: {
      type: String,
      required: [true, 'A post must have a title'],
    },
    description: String,
    images: [String],
    job: {
      type: String,
      enum: Job,
      required: [true, 'Please specify the required job for this post.'],
    },
    location: {
      title: String,
      lat: Number,
      lng: Number,
    },
    price: {
      type: Number,
      min: [0, "Can't have a price less than zero"],
    },
    selectedWorkers: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Worker',
      },
    ],
    _deletedAt: {
      type: Date,
      default: null,
    },
    hidden: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

PostSchema.pre(/^find/, function (next) {
  // Filter out documents with _deletedAt set (including non-null values)
  (this as any).where({ _deletedAt: null });
  next();
});

PostSchema.pre(/^find/, function <PostDoc>(next: NextFunction) {
  this.populate({
    path: 'user',
    select: 'name profilePicture wilaya', // Select specific fields from the user model
  });
  // this.populate({ path: 'selectedWorkers' });

  next();
});

export const Post = mongoose.model<PostDoc>('Post', PostSchema);
