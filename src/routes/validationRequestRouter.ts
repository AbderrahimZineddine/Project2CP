import authController from '../controller/authController';
import validationRequestController from '../controller/validationRequestController';
import { Router } from 'express';

const router = Router();

router.use(authController.protect, authController.restrictTo('Admin'));

router.patch(
  '/:id/approveRequest',
  validationRequestController.approveValidationRequest
);

router.patch(
  '/:id/disapproveRequest',
  validationRequestController.disapproveValidationRequest
);

router.get('/:id', validationRequestController.getValidationRequestById);
router.get('/', validationRequestController.getAllValidationRequests);

export default router;
