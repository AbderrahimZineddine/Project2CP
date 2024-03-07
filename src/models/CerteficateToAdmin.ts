import { createOne } from '../controller/handlerFactory';
import { MyRequest } from 'controller/userController/userController';
import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';
import catchAsync from 'utils/catchAsync';

const CerteficateToAdminSchema = new mongoose.Schema({
  worker: {
    id: {
      type: mongoose.Schema.ObjectId,
      ref: 'Worker',
      required: [
        true,
        'A certeficate must reference a worker, provide worker id!',
      ],
    },
    name: String, //TODO check later
    job: String,
  },
  title: {
    type: String,
    required: [true, 'A certificate must be have a title!'],
  },
  image: {
    type: String,
    required: [true, 'A certificate must be have an image!'],
  },
  status: {
    type: String,
    enum: ['new', 'viewed'],
    default: 'new',
  },
});

export interface CerteficateDoc extends mongoose.Document {
  worker: {
    id: mongoose.Schema.Types.ObjectId;
    name: string;
    job: string;
  };
  title: string;
  image: string;
  status: ['new', 'viewed'];
}

export const CerteficateToAdmin = mongoose.model<CerteficateDoc>(
  'Certeficate',
  CerteficateToAdminSchema
);

