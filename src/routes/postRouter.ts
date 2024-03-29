import authController from '../controller/authController';
import uploadController from '../controller/uploadController';
import postController from '../controller/postController';
import { Router } from 'express';
import applicationController from '../controller/applicationController';

const router = Router();

router.get(
  '/me',
  authController.protect,
  authController.restrictTo('User'),
  postController.getMyPosts
);

router.get('/:id', postController.getPostById);
router.get('/', postController.getAllPosts);

router.use(authController.protect);

router.patch(
  '/:id/save',
  authController.restrictTo('Worker'),
  postController.savePost
);

router.use(authController.restrictTo('User'));

router.get('/:id/applications',postController.checkOwnerPost, applicationController.getMyPostsApplications);

router.post(
  '/',
  uploadController.upload.array('images'),
  postController.ValidatePostInputs,
  uploadController.uploadImages,
  postController.createPost
);

router.patch(
  '/:id',
  postController.checkOwnerPost,
  uploadController.upload.array('images'),
  uploadController.uploadImages,
  postController.updatePost
);

router.delete(
  '/:id',
  postController.checkOwnerPost,
  postController.deletePostById
);

export default router;
