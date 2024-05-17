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
const Notification_1 = require("../models/Notification");
const router = express_1.default.Router();
router.route('/').get(userController_1.default.getAllUsers);
router.route('/map').get(userController_1.default.getMap);
// router.use(authController.protect);
router.get('/me/reviews', authController_1.default.protect, reviewController_1.default.getMyReviews, reviewController_1.default.getAllReviews);
router.get('/me/notifications', authController_1.default.protect, Notification_1.notificationController.getMyNotificationsById, Notification_1.notificationController.getAllNotifications);
router.get('/me/notificationsCount', authController_1.default.protect, Notification_1.notificationController.getMyNotificationsById, Notification_1.notificationController.newNotificationsCount);
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
router.get('/:id/favoriteWorkers', userController_1.default.getFavoriteWorkersFromUserId);
router.get('/:id/notifications', Notification_1.notificationController.getUserNotificationsById, Notification_1.notificationController.getAllNotifications);
router.get('/:id/notificationsCount', Notification_1.notificationController.getUserNotificationsById, Notification_1.notificationController.newNotificationsCount);
router.get('/:id/posts', postController_1.default.getPostsFromUserById, postController_1.default.getAllPosts);
router.get('/:id/deals', dealController_1.default.getDealsFromUserById, dealController_1.default.showDeletedMiddleware, dealController_1.default.sortMiddleware, dealController_1.default.getAllDeals);
router.get('/:id/reviews', reviewController_1.default.getReviewsFromUserById, reviewController_1.default.getAllReviews);
//restrictLater
router
    .route('/:id')
    .get(userController_1.default.getUser)
    .patch(userController_1.default.updateUser)
    .delete(userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map