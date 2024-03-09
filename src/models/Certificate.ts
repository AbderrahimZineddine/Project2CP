import mongoose from 'mongoose';

export interface CertificateDoc extends mongoose.Document {
  title: string;
  image: string;
  isValid : boolean;
}

const certificateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A certificate must have a title!'],
  },
  image: {
    type: String,
    required: [true, 'A certificate must have an image!'],
  },
  isValid: {
    type: Boolean,
    default: false,
  },
});

export const Certificate = mongoose.model<CertificateDoc>(
  'Certificate',
  certificateSchema
);
