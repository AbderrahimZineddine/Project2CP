import express from 'express';
import authController from '../controller/authController/authController';

const router = express.Router();

//outside app : 
router.post('/signup', authController.signup);
router.post('/verifyEmail', authController.verifyEmail);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword', authController.resetPassword);


//in App :
router.use(authController.protect);
router.get('/logout', authController.logout);
router.patch('/switch', authController.switchRole);
router.patch('/updatePassword', authController.updatePassword);
router.patch('/updateEmail', authController.updateEmail);
router.post(
    '/signupAsWorker',
    authController.restrictTo('User'),
    authController.signupAsWorker
  );
export default router;
