import { UserDoc } from 'models/UserDoc';
import { Request, Response, NextFunction } from 'express';
import { WorkerDoc } from '../models/WorkerDoc';
import { signup } from './authController/signup';
import { login } from './authController/login';
import { switchRole } from './authController/switchRole';
import { signupAsWorker } from './authController/signupAsWorker';
import { isLoggedIn } from './authController/isLoggedIn';
import { protect } from './authController/protect';
import { forgotPassword } from './authController/forgotPassword';
import { resetPassword } from './authController/resetPassword';
import { updatePassword } from './authController/updatePassword';
import { verifyEmail } from './authController/verifyEmail';
import { restrictTo } from './authController/restrictTo';
import { logout } from './authController/logout';
import { updateEmail } from './authController/updateEmail';
import sendVerificationEmail from './authController/resendEmailVerification';
import verifyAlreadySignedUp from './authController/verifyWorkerSignup';

export interface MyRequest extends Request {
  user: UserDoc | WorkerDoc;
}
export enum Role {
  User = 'User',
  Worker = 'Worker',
}

const authController = {
  signup: signup,
  login: login,
  logout: logout,
  switchRole: switchRole,
  signupAsWorker: signupAsWorker,
  isLoggedIn: isLoggedIn,
  protect: protect,
  forgotPassword: forgotPassword,
  resetPassword: resetPassword,
  updatePassword: updatePassword,
  verifyEmail: verifyEmail,
  restrictTo: restrictTo,
  updateEmail: updateEmail,
  sendVerificationEmail: sendVerificationEmail,
  verifyAlreadySignedUp: verifyAlreadySignedUp,
};

export default authController;
