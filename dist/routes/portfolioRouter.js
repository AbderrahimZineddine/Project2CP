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
router.get('/:id', portfolioPostsController_1.default.getPortfolioPostById);
router.use(authController_1.default.protect);
router.use(authController_1.default.restrictTo('Worker'));
router.post('/', uploadController_1.default.upload.array('images'), uploadController_1.default.uploadPortfolioPostImages, portfolioPostsController_1.default.createPortfolioPost);
router.patch('/:id/like', portfolioPostsController_1.default.toggleLikePortfolioPost);
router.patch('/:id', portfolioPostsController_1.default.checkOwnerPortfolioPost, uploadController_1.default.upload.array('images'), uploadController_1.default.uploadPortfolioPostImages, portfolioPostsController_1.default.updatePortfolioPost);
router.delete('/:id', portfolioPostsController_1.default.checkOwnerPortfolioPost, portfolioPostsController_1.default.deletePortfolioPostById);
exports.default = router;
//# sourceMappingURL=portfolioRouter.js.map