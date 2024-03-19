import mongoose from 'mongoose';

export interface ApplicationDoc extends mongoose.Document {
  worker: mongoose.Schema.Types.ObjectId;
  post: mongoose.Schema.Types.ObjectId;
  description: string;
  price: number;
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
  },
  {
    timestamps: true,
  }
);

export const Application = mongoose.model<ApplicationDoc>(
  'Application',
  ApplicationSchema
);
