import { Review } from '../models/Review';
import { getOne, getAll } from './handlerFactory';
import { checkOwnerReview } from './reviewController/checkOwnerReview';
import {
  ValidateReviewInputs,
  createReview,
} from './reviewController/createReview';
import { deleteReview } from './reviewController/deleteReview';
import {
  getMyReviews,
  getMyWorkerReviews,
  getWorkerReviews,
} from './reviewController/getMyReviews';
import { updateReview } from './reviewController/updateReview';

const reviewController = {
  createReview: createReview,
  ValidateReviewInputs: ValidateReviewInputs,
  getMyReviews: getMyReviews,
  getReviewById: getOne(Review),
  getAllReviews: getAll(Review),
  getWorkerReviews: getWorkerReviews,
  getMyWorkerReviews: getMyWorkerReviews,
  updateReview: updateReview,
  deleteReviewById: deleteReview,
  checkOwnerReview: checkOwnerReview,
};
export default reviewController;
