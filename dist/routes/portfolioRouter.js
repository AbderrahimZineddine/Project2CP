"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const portfolioPostsController_1 = __importDefault(require("../controller/workerController/portfolioPostsController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/:id', authController_1.default.isLoggedIn, portfolioPostsController_1.default.getPortfolioPostById);
// router.use(authController.protect);
// router.use(authController.restrictTo('Worker'));
router.post('/', authController_1.default.protect, authController_1.default.restrictTo('Worker'), uploadController_1.default.upload.array('images'), uploadController_1.default.uploadImages, portfolioPostsController_1.default.createPortfolioPost);
router.get('/', portfolioPostsController_1.default.getAllPortfolioPosts);
router.patch('/:id/like', authController_1.default.protect, authController_1.default.restrictTo('User'), portfolioPostsController_1.default.toggleLikePortfolioPost);
router.patch('/:id', authController_1.default.protect, authController_1.default.restrictTo('Worker'), portfolioPostsController_1.default.checkOwnerPortfolioPost, uploadController_1.default.upload.array('images'), uploadController_1.default.uploadImages, portfolioPostsController_1.default.updatePortfolioPost);
router.delete('/:id', authController_1.default.protect, authController_1.default.restrictTo('Worker'), portfolioPostsController_1.default.checkOwnerPortfolioPost, portfolioPostsController_1.default.deletePortfolioPostById);
exports.default = router;
//# sourceMappingURL=portfolioRouter.js.map