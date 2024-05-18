import catchAsync from '../../utils/catchAsync';
import { Response } from 'express';
import { MyRequest } from '../authController';

export const logout = catchAsync(async (req: MyRequest, res: Response) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  }); //* setting "loggedout" help in client-side handling  - better then just removing the cookie

  const user = req.user;
  if (req.body.fcmToken) {
    if (user.fcmTokens && user.fcmTokens.includes(req.body.fcmToken)) {
      user.fcmTokens = user.fcmTokens.filter(
        (token) => token != req.body.fcmToken
      );
      user.save({ validateBeforeSave: false });
    }
  }

  res.status(200).json({ status: 'success' });
});
