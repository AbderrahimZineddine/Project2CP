import { UserDoc } from 'models/UserDoc';
import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { MyRequest } from '../authController';

export function createAndSendToken(
  user: UserDoc,
  statusCode: number,
  req: MyRequest,
  res: Response
) {
  console.log('user is : \n', user);
  // payload : { _id: user._id.toString() }  This is the data you want to include in the JWT //TODO add current Role;
  const token = jwt.sign(
    { id: user.id.toString(), currentRole: user.currentRole },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  const number = process.env.JWT_COOKIE_EXPIRES_IN as unknown as number;
  const cookieOptions = {
    expires: new Date(Date.now() + number * 24 * 60 * 60 * 1000), // 90days
    // secure: req.secure || req.headers['x-forwarded-proto'] == 'https', //TODO : change later 
    secure: false,
    httpOnly: true, //* cannot be accessed or modified through JavaScript on the client-side
  };

  res.cookie('jwt', token, cookieOptions);

  user.authentication.password = undefined;
  //  const { password, ...other} = user;
  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
}
