import mongoose from 'mongoose';
import { Job } from './WorkerDoc';

export interface PostDoc extends mongoose.Document {
  user: mongoose.Schema.Types.ObjectId;
  title: string;
  description: string;
  job: Job;
  images: string[];
  selectedWorkers: mongoose.Schema.Types.ObjectId[];
}

const PostSchema = new mongoose.Schema({
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
  selectedWorkers: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
    },
  ],
}, {timestamps : true});

export const Post = mongoose.model<PostDoc>('Post', PostSchema);
