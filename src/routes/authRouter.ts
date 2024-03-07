import express from 'express';
import authController from '../controller/authController/authController';
import userController from '../controller/userController/userController';
import workerController from '../controller/workerController/workerController';

const router = express.Router();

//outside app :
router.post('/signup', authController.signup);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);

router.post('/sendVerificationEmail', authController.sendVerificationEmail);

//in App :
router.use(authController.protect);
router.get('/logout', authController.logout);
router.patch('/switch', authController.switchRole);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateEmail', authController.updateEmail);
router.post(
  '/signupAsWorker',
  authController.restrictTo('User'),
  authController.verifyAlreadySignedUp,
  // userController.upload.single('idPicture'),
  // userController.upload.array('certeficatesImages', 10),
  userController.upload.fields([
    {
      name: 'idPicture',
      maxCount: 1,
    },
    {
      name: 'certeficatesImages',
      maxCount: 10,
    },
  ]),
  userController.uploadId,
  workerController.uploadCerteficates,
  authController.signupAsWorker
);
export default router;
