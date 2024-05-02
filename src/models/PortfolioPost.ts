import mongoose from 'mongoose';

export interface PortfolioPostDoc extends mongoose.Document {
  images: string[];
  description: string;
  likes: number;
  createdAt: Date;
}

const PortfolioPostSchema = new mongoose.Schema(
  {
    images: {
      type: [String],
      required: [true, 'At least one image must be provided'],
    },
    description: String,
    likes: {
      type: Number,
      default: 0,
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

PortfolioPostSchema.pre(/^find/, function (next) {
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

export const PortfolioPost = mongoose.model<PortfolioPostDoc>(
  'PortfolioPost',
  PortfolioPostSchema
);
