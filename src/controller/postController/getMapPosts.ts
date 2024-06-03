import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';

export const getMap = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input parameters
      if (!req.query.lat || !req.query.lng || !req.query.diameter) {
        return next(new AppError('Missing parameters', 400));
      }

        if (
          isNaN(parseFloat(req.query.lat as string)) ||
          isNaN(parseFloat(req.query.lng as string)) ||
          isNaN(parseFloat(req.query.diameter as string))
        ) {
          return next(new AppError('Invalid parameters provided', 400));
        }

      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      const diameter = parseFloat(req.query.diameter as string);

      // Calculate the geographical area boundaries
      const xLat = lat - diameter / 2;
      const xLng = lng - diameter / 2;
      const yLat = lat + diameter / 2;
      const yLng = lng + diameter / 2;

      let posts : any = [];
      if (req.query.job) {
        posts = await Post.find({
          'location.lat': { $gte: xLat, $lte: yLat },
          'location.lng': { $gte: xLng, $lte: yLng },
          job: req.query.job,
        });
      } else {

        posts = await Post.find({
          'location.lat': { $gte: xLat, $lte: yLat },
          'location.lng': { $gte: xLng, $lte: yLng },
        });
      }

      res.status(200).json({
        status: 'success',
        results : posts.length,
        posts,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }
);
