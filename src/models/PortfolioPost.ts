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
  // Filter out documents with _deletedAt set (including non-null values)
  ( this as any).where({ _deletedAt: { $exists: false } });
  next();
});


export const PortfolioPost = mongoose.model<PortfolioPostDoc>('PortfolioPost', PortfolioPostSchema);


