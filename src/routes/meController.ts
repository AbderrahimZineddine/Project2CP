import express from 'express';
import workerController from '../controller/workerController/workerController';
import authController from '../controller/authController/authController';

const router = express.Router();

router.use(authController.protect);

// router.get('/', workerController.getMe, workerController.getWorker);


// router.patch(
//   '/editMe',
//   authController.restrictTo('Worker'),
//   workerController.uploadProfilePicture,
//   workerController.resizeProfilePicture,
//   workerController.editMeWorker
// );


export default router;
