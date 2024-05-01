"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Review_1 = require("../models/Review");
const handlerFactory_1 = require("./handlerFactory");
const checkOwnerReview_1 = require("./reviewController/checkOwnerReview");
const createReview_1 = require("./reviewController/createReview");
const deleteReview_1 = require("./reviewController/deleteReview");
const getMyReviews_1 = require("./reviewController/getMyReviews");
const updateReview_1 = require("./reviewController/updateReview");
const reviewController = {
    createReview: createReview_1.createReview,
    ValidateReviewInputs: createReview_1.ValidateReviewInputs,
    getMyReviews: getMyReviews_1.getMyReviews,
    getReviewById: (0, handlerFactory_1.getOne)(Review_1.Review),
    getAllReviews: (0, handlerFactory_1.getAll)(Review_1.Review),
    getWorkerReviews: getMyReviews_1.getWorkerReviews,
    getReviewsFromUserById: getMyReviews_1.getReviewsFromUserById,
    getMyWorkerReviews: getMyReviews_1.getMyWorkerReviews,
    updateReview: updateReview_1.updateReview,
    deleteReviewById: deleteReview_1.deleteReview,
    checkOwnerReview: checkOwnerReview_1.checkOwnerReview,
};
exports.default = reviewController;
//# sourceMappingURL=reviewController.js.map