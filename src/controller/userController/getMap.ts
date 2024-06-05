import { NextFunction, Request, Response } from 'express';
import AppError from '../../utils/appError';
import catchAsync from '../../utils/catchAsync';
import { Worker } from '../../models/Worker';

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
      
      let workers: any = [];
      if (req.query.job) {
        workers = await Worker.find({ job: req.query.job });
      } else {
        workers = await Worker.find();
      }
      let i= 1 ;
      // Filter workers based on distance from the center point
      const workersWithinDiameter = workers.filter((worker: any) => {
        const workerLat = worker.location.lat;
        const workerLng = worker.location.lng;
        const distance = haversineDistance(lat, lng, workerLat, workerLng);
        return distance <= diameter / 2;
      });

      res.status(200).json({
        status: 'success',
        results: workersWithinDiameter.length,
        workers: workersWithinDiameter,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  }
);
