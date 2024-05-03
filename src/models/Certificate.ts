import mongoose from 'mongoose';

export interface CertificateDoc extends mongoose.Document {
  title: string;
  image: string;
  isValid: boolean;
  _deletedAt: Date;
  _acceptedAt: Date;
  _createdAt: Date;
}

const certificateSchema = new mongoose.Schema(
  {
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
    _deletedAt: {
      type: Date,
      default: null, //TODO : check default and add validator
    },
    _acceptedAt: {
      type: Date,
      default: null, //TODO : check default and add validator
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.pre(/^find/, function (next) {
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

export const Certificate = mongoose.model<CertificateDoc>(
  'Certificate',
  certificateSchema
);
