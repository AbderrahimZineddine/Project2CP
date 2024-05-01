"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const authController_1 = __importDefault(require("../controller/authController"));
const User_1 = require("../models/User");
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const reviewController_1 = __importDefault(require("../controller/reviewController"));
const postController_1 = __importDefault(require("../controller/postController"));
const dealController_1 = __importDefault(require("../controller/dealController"));
const workerController_1 = __importDefault(require("../controller/workerController"));
const router = express_1.default.Router();
router.route('/').get(userController_1.default.getAllUsers);
// router.use(authController.protect);
// router.get(
//   '/me/reviews',
//   authController.protect,
//   reviewController.getMyReviews,
//   reviewController.getAllReviews
// );
// router.get(
//   '/me/posts',
//   authController.protect,
//   postController.getMyPosts,
//   postController.getAllPosts
// );
router.get('/me/favoriteWorkers', authController_1.default.protect, userController_1.default.getFavoriteWorkers, workerController_1.default.getAllWorkers);
router.get('/me', authController_1.default.protect, userController_1.default.getMe, userController_1.default.getUser);
router.patch('/editMe', authController_1.default.protect, authController_1.default.restrictTo('User'), uploadController_1.default.upload.single('profilePicture'), uploadController_1.default.uploadProfilePicture, userController_1.default.editMe(User_1.User));
// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router.route('/').post(userController_1.default.createUser);
// .get(userController.getAllUsers)
router.get(':/id/posts', postController_1.default.getPostsFromUserById, postController_1.default.getAllPosts);
router.get(':/id/deals', dealController_1.default.getDealsFromUserById, dealController_1.default.sortMiddleware, dealController_1.default.getAllDeals);
router.get(':/id/reviews', reviewController_1.default.getReviewsFromUserById, reviewController_1.default.getAllReviews);
//restrictLater
router
    .route('/:id')
    .get(userController_1.default.getUser)
    .patch(userController_1.default.updateUser)
    .delete(userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map