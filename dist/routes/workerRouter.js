"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const workerController_1 = __importDefault(require("../controller/workerController"));
const authController_1 = __importDefault(require("../controller/authController"));
const userController_1 = __importDefault(require("../controller/userController"));
const Worker_1 = require("../models/Worker");
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const reviewController_1 = __importDefault(require("../controller/reviewController"));
const dealController_1 = __importDefault(require("../controller/dealController"));
const portfolioPostsController_1 = __importDefault(require("../controller/workerController/portfolioPostsController"));
exports.router = express_1.default.Router();
exports.router.get('/me/reviews', authController_1.default.protect, authController_1.default.restrictTo('Worker'), reviewController_1.default.getMyWorkerReviews, reviewController_1.default.getAllReviews);
exports.router.get('/me/portfolioPosts', authController_1.default.protect, authController_1.default.restrictTo('Worker'), portfolioPostsController_1.default.getMyPortfolioPosts);
exports.router.get('/me/requests', authController_1.default.protect, authController_1.default.restrictTo('Worker'), workerController_1.default.getMyRequests);
exports.router.delete('/me/requests/:id', authController_1.default.protect, authController_1.default.restrictTo('Worker'), workerController_1.default.deleteRequestById);
exports.router.get('/me', authController_1.default.protect, authController_1.default.restrictTo('Worker'), userController_1.default.getMe, workerController_1.default.getWorkerById);
exports.router
    .route('/')
    .get(authController_1.default.protect, authController_1.default.restrictTo('User'), workerController_1.default.getAllWorkers);
exports.router.get('/:id/reviews', reviewController_1.default.getWorkerReviews, reviewController_1.default.getAllReviews);
exports.router.get('/:id/portfolioPosts', authController_1.default.isLoggedIn, portfolioPostsController_1.default.getPortfolioPostsFromWorkerById);
exports.router.get('/:id/savedPosts', 
// authController.protect,
// authController.restrictTo('Worker'),
workerController_1.default.getWorkerSavedPostsById);
exports.router.get('/:id/certificates', workerController_1.default.getWorkerCertificatesById);
exports.router.get('/:id/deals', 
// authController.protect,
dealController_1.default.getDealsFromWorkerById, dealController_1.default.showDeletedMiddleware, dealController_1.default.sortMiddleware, dealController_1.default.getAllDeals);
exports.router.patch('/:id/favorite', authController_1.default.protect, userController_1.default.ToggleFavoriteWorker);
exports.router.get('/:id', authController_1.default.protect, authController_1.default.restrictTo('User'), workerController_1.default.getWorkerById);
//! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
exports.router.use(authController_1.default.protect);
exports.router.use(authController_1.default.restrictTo('Worker'));
exports.router.patch('/editMe', 
// userController.upload.single('profilePicture'),
uploadController_1.default.upload.single('profilePicture'), uploadController_1.default.uploadProfilePicture, 
// userController.upload.array('certificates'),
// uploadController.uploadCertificates,
workerController_1.default.editMeWorker, userController_1.default.editMe(Worker_1.Worker));
// router.use(restrictTo('admin')); //TODO add later
// CRUD :
exports.router.route('/').post(workerController_1.default.createWorker);
exports.router
    .route('/:id') //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
    .patch(workerController_1.default.updateWorker)
    .delete(workerController_1.default.deleteWorker);
exports.default = exports.router;
//# sourceMappingURL=workerRouter.js.map