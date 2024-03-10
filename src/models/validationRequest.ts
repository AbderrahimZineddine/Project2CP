import mongoose from 'mongoose';
import AppError from 'utils/appError';

export interface validationRequestDoc extends mongoose.Document {
  // worker: {
  //   id: mongoose.Schema.Types.ObjectId;
  //   name: string;
  //   job: string;
  // };
  worker: mongoose.Schema.Types.ObjectId;
  certificate: mongoose.Schema.Types.ObjectId;
  idPicture: string;
  status: ['new', 'viewed'];
  type: ['Ceritficate', 'IdPicture'];
}
const validationRequestSchema = new mongoose.Schema({
  worker: {
    type: mongoose.Schema.ObjectId,
    ref: 'Worker',
    required: [
      true,
      'A certificate must reference a worker, provide worker id!',
    ],
  },

  certificate: {
    type: mongoose.Schema.ObjectId,
    ref: 'Certificate',
  },
  idPicture: String,
  status: {
    type: String,
    enum: ['new', 'viewed'],
    default: 'new',
  },
  type: {
    type: String,
    enum: ['Ceritficate', 'idPicture'],
    required: [true, 'Please specify the type of the validation request'],
  },
});

export const ValidationRequest = mongoose.model<validationRequestDoc>(
  'ValidationRequest',
  validationRequestSchema
);

export const ValidateCertificateCreate = async (
  id: string,
  certificate: string
) => {
  return await ValidationRequest.create({
    worker: id,
    certificate,
    type: 'Certificate',
  });
};

export const ValidateIdPictureCreate = async (
  id: string,
  idPicture: string
) => {
  return await ValidationRequest.create({
    worker: id,
    idPicture,
    type: 'IdPicture',
  });
};
