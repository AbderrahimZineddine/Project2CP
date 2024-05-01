import authController from '../controller/authController';
import applicationController from '../controller/applicationController';
import { Router } from 'express';

const router = Router();

router.get(
  '/me',
  authController.protect,
  authController.restrictTo('Worker'),
  applicationController.getMyApplications,
  applicationController.getAllApplications
);

router.get('/:id', applicationController.getApplicationById);
router.get('/', applicationController.getAllApplications);

router.use(authController.protect);

router.use(authController.restrictTo('Worker'));

router.post(
  '/:id', //here it is post id!!!
  applicationController.ValidateApplicationInputs,
  applicationController.applyPost
);

router.patch(
  '/:id',
  applicationController.checkOwnerApplication,
  applicationController.updateApplication
);

router.delete(
  '/:id',
  applicationController.checkOwnerApplication,
  applicationController.deleteApplication
);

export default router;
