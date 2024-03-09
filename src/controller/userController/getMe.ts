import { Response, NextFunction } from 'express';
import { MyRequest } from '../userController';

export const getMe = (req: MyRequest, res: Response, next: NextFunction) => {
  req.params.id = req.user.id;
  next();
};
