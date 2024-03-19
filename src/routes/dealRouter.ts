import authController from '../controller/authController';
import dealController from '../controller/dealController';
import { Router } from 'express';

const router = Router();

router.get('/me', authController.protect, dealController.getMyDeals);

router.get('/:id', dealController.getDealById);
router.use(authController.protect);

router.post(
  '/:id', //here it is application id!!!
  authController.restrictTo('User'),
  dealController.ValidateDealInputs,
  dealController.createDeal
);

router.patch('/:id', dealController.checkOwnerDeal, dealController.updateDeal);

router.patch(
  '/:id/finishRequest',
  dealController.checkOwnerDeal,
  dealController.finishDealRequest
);

router.patch(
  '/:id/finishDecline',
  dealController.checkOwnerDeal,
  dealController.finishDealDecline
);

router.delete(
  '/:id',
  dealController.checkOwnerDeal,
  dealController.deleteDealById
);

export default router;
