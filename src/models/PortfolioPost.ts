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
  },
  {
    timestamps: true,
  }
);

export const PortfolioPost = mongoose.model<PortfolioPostDoc>('PortfolioPost', PortfolioPostSchema);


