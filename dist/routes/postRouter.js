"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const postController_1 = __importDefault(require("../controller/postController"));
const express_1 = require("express");
const applicationController_1 = __importDefault(require("../controller/applicationController"));
const router = (0, express_1.Router)();
router.get('/me', authController_1.default.protect, authController_1.default.restrictTo('User'), postController_1.default.getMyPosts);
router.get('/:id', postController_1.default.getPostById);
router.get('/', postController_1.default.getAllPosts);
router.use(authController_1.default.protect);
router.patch('/:id/save', authController_1.default.restrictTo('Worker'), postController_1.default.savePost);
router.use(authController_1.default.restrictTo('User'));
router.get('/:id/applications', postController_1.default.checkOwnerPost, applicationController_1.default.getMyPostsApplications);
router.post('/', uploadController_1.default.upload.array('images'), postController_1.default.ValidatePostInputs, uploadController_1.default.uploadImages, postController_1.default.createPost);
router.patch('/:id', postController_1.default.checkOwnerPost, uploadController_1.default.upload.array('images'), uploadController_1.default.uploadImages, postController_1.default.updatePost);
router.delete('/:id', postController_1.default.checkOwnerPost, postController_1.default.deletePostById);
exports.default = router;
//# sourceMappingURL=postRouter.js.map