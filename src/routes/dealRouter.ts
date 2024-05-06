import authController from '../controller/authController';
import dealController from '../controller/dealController';
import { Router } from 'express';

const router = Router();

router.get(
  '/me',
  authController.protect,
  dealController.getMyDeals,
  dealController.showDeletedMiddleware,
  dealController.sortMiddleware,
  dealController.getAllDeals
);

router.get('/:id', dealController.getDealById, dealController.getAllDeals);
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
  authController.restrictTo('Worker'),
  dealController.checkOwnerDeal,
  dealController.finishDealRequest
);

router.patch(
  '/:id/finishDecline',
  dealController.checkOwnerDeal,
  dealController.finishDealDecline
);

router.patch(
  '/:id/finishAccept',
  authController.restrictTo('User'),
  dealController.checkOwnerDeal,
  dealController.finishDealAccept
);

router.delete(
  '/:id',
  dealController.checkOwnerDeal,
  dealController.deleteDealById
);

router.get(
  '/',
  dealController.showDeletedMiddleware,
  dealController.sortMiddleware,
  dealController.getAllDeals
);
export default router;
