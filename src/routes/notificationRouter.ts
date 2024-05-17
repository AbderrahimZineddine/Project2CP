import { notificationController } from '../models/Notification';
import authController from '../controller/authController';
import { Router } from 'express';

const router = Router();

router.use(authController.protect);

router.patch(
  '/:id/viewed',
  notificationController.checkReceiverNotifications,
  notificationController.notificationViewed
);

router.delete(
  '/:id',
  authController.protect,
  notificationController.checkReceiverNotifications,
  notificationController.deleteNotificationById
);

router.get('/:id', notificationController.getNotificationById);

router.get('/', notificationController.getAllNotifications);

export default router;
