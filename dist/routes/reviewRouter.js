"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const reviewController_1 = __importDefault(require("../controller/reviewController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/me/user', authController_1.default.protect, reviewController_1.default.getMyReviews, reviewController_1.default.getAllReviews);
router.get('/me/worker', authController_1.default.protect, reviewController_1.default.getMyWorkerReviews, reviewController_1.default.getAllReviews);
router.get('/:id', reviewController_1.default.getReviewById);
router.use(authController_1.default.protect);
router.post('/:id', //here it is application id!!!
authController_1.default.restrictTo('User'), reviewController_1.default.ValidateReviewInputs, reviewController_1.default.createReview);
router.patch('/:id', reviewController_1.default.checkOwnerReview, reviewController_1.default.updateReview);
router.delete('/:id', reviewController_1.default.checkOwnerReview, reviewController_1.default.deleteReviewById);
router.get('/', reviewController_1.default.getAllReviews);
exports.default = router;
//# sourceMappingURL=reviewRouter.js.map