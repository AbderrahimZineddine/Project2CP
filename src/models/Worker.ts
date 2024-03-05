import mongoose from 'mongoose';
import { User } from './User';

const workerSchema = new mongoose.Schema(
  {
    workerAccountVerified: {
      type: Boolean,
      default: false,
    },
    job: {
      type: String,
      enum: ['Architect', 'Designer'],
      required: [true, 'A worker must have a job'],
    },
    certificates: [
      {
        title: String,
        picture: String,
      },
    ],
    // isCertified: Boolean,// TODO: change to Virtual
    idPicture: {
      type: String,
      required: [true, 'a Worker must enter his id picture'],
    },
    location: String,
    rating: {
      type: Number,
      min: [0, 'cannot be below 0'],
      max: [5, 'must be below 5'],
      default: 0,
    },
    experience: {
      type: Number,
      default: 0,
    },
    //TODO ask if reports on user and worker are the same !
    portfolioPosts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'PortfolioPost',
      },
    ],
  },
  {
    // show virtual properties
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

workerSchema.virtual('isCertified').get(function () {
  return this.certificates?.length > 0;
});

export const Worker = User.discriminator('Worker', workerSchema);
