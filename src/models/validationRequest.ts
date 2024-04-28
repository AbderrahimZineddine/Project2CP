import mongoose from 'mongoose';
import AppError from 'utils/appError';
import { WorkerDoc } from './WorkerDoc';
import { CertificateDoc } from './Certificate';
import { NextFunction } from 'express';

export enum ValidationType {
  Certificate = 'Certificate',
  IdPicture = 'IdPicture',
}

export interface validationRequestDoc extends mongoose.Document {
  // worker: {
  //   id: mongoose.Schema.Types.ObjectId;
  //   name: string;
  //   job: string;
  // };
  // worker: mongoose.Schema.Types.ObjectId;
  // certificate: mongoose.Schema.Types.ObjectId;
  worker: WorkerDoc;
  certificate: CertificateDoc;
  // idPicture: string;
  status: ['new', 'viewed'];
  type: ValidationType;
}
const validationRequestSchema = new mongoose.Schema(
  {
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
    // idPicture: String,
    status: {
      type: String,
      enum: ['new', 'viewed'],
      default: 'new',
    },
    type: {
      type: String,
      enum: ValidationType,
      required: [true, 'Please specify the type of the validation request'],
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

validationRequestSchema.pre(/^find/, function (next) {
  // Filter out documents with _deletedAt set (including non-null values)
  (this as any).where({ _deletedAt: { $exists: false } });
  next();
});

validationRequestSchema.pre(/^find/, function <
  validationRequestDoc
>(next: NextFunction) {
  console.log(this);
  // if (this.certificate) {
  //   this.populate('certificate');
  // }
  // if (this.worker) {
  //   this.populate('worker');
  // }
  this.populate({ path: 'worker' });
  this.populate({ path: 'certificate' });
  next();
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
