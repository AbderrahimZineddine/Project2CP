import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Post } from '../../models/Post';

// Helper function to calculate the Haversine distance between two points
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const toRad = (value: number) => value * Math.PI / 180;

  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
};

export const getMap = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate input parameters
      if (!req.query.lat || !req.query.lng || !req.query.diameter) {
        return next(new AppError('Missing parameters', 400));
      }

      const lat = parseFloat(req.query.lat as string);
      const lng = parseFloat(req.query.lng as string);
      let diameter = parseFloat(req.query.diameter as string);

      if (isNaN(lat) || isNaN(lng) || isNaN(diameter)) {
        return next(new AppError('Invalid parameters provided', 400));
      }
      
      diameter = diameter / 1000;
      
      let posts: any = [];
      if (req.query.job) {
        posts = await Post.find({ job: req.query.job });
      } else {
        posts = await Post.find();
      }
      let i= 1 ;
      // Filter posts based on distance from the center point
      const postsWithinDiameter = posts.filter((post: any) => {
        const postLat = post.location.lat;
        const postLng = post.location.lng;
        const distance = haversineDistance(lat, lng, postLat, postLng);
        return distance <= diameter / 2;
      });

      res.status(200).json({
        status: 'success',
        results: postsWithinDiameter.length,
        posts: postsWithinDiameter,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }
);
