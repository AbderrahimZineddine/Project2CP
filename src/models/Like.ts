import mongoose from 'mongoose';

export interface LikeDoc extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  postId: mongoose.Schema.Types.ObjectId;
}

const LikeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  postId: {
    type: mongoose.Schema.ObjectId,
    ref: 'PortfolioPost',
  },
  
});

export const Like = mongoose.model<LikeDoc>('Like', LikeSchema);
