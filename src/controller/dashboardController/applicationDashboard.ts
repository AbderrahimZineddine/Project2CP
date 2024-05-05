import { MyRequest } from '../userController';
import { NextFunction, Response } from 'express';
import { Application, ApplicationDoc } from '../../models/Application';
import catchAsync from '../../utils/catchAsync';
import { WorkerDoc } from '../../models/WorkerDoc';

export const applicationTotal = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalApplications = await Application.countDocuments();

    // Find the total number of distinct workers
    const distinctWorkers = await Application.distinct('worker');

    // Calculate the average applications per worker
    const averageApplications = totalApplications / distinctWorkers.length;

    res.status(200).json({
      status: 'success',
      data: {
        // {
        //   _id: 'Created',
        //   count: totalApplications,
        // },
        created: totalApplications,
        // {
        //   _id: 'Average applications per worker',
        //   count: averageApplications,
        // },
        averageApplicationsPerWorker: averageApplications,
      },
    });
  }
);

export const averageApplicationPerJob = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    const applications = await Application.find();

    const applicationByJob = applications.reduce(
      (acc: any, curr: ApplicationDoc) => {
        const job = (curr.worker as unknown as WorkerDoc).job;
        if (job) {
          if (!acc[job]) {
            acc[job] = 0;
          }
          acc[job]++;
        }
        return acc;
      },
      {}
    );

    const totalJobs = Object.keys(applicationByJob).length;

    const totalApplications: any = Object.values(applicationByJob).reduce(
      (total: number, count: number) => total + count,
      0
    );

    const averageApplicationPerJob = totalApplications / totalJobs;

    res.status(200).json({
      status: 'success',
      data: {
        averageApplicationPerJob: averageApplicationPerJob,
      },
    });
  }
);

export const applicationPerJobPercentage = catchAsync(
  async (req: MyRequest, res: Response, next: NextFunction) => {
    // Count the total number of applications
    const totalApplications = await Application.countDocuments();

    // Find the total number of distinct workers
    const jobApplications = await Application.aggregate([
      {
        $lookup: {
          from: 'users', // Collection to join with (parent collection)
          localField: 'worker', // Field from the Application collection
          foreignField: '_id', // Field from the User collection
          as: 'workerData', // Alias for the joined documents
        },
      },
      { $unwind: '$workerData' },
      {
        $group: {
          _id: '$workerData.job', // Group by job
          count: { $sum: 1 }, // Count the number of applications for each job
        },
      },
    ]);

    const jobPercentages = jobApplications.map((jobApp: any) => ({
      job: jobApp._id,
      percentage: (jobApp.count / totalApplications) * 100, // Calculate percentage
    }));

    // const percentagesByJob: { [key: string]: number } = {};
    // jobPercentages.forEach((jobPercentage: any) => {
    //   percentagesByJob[jobPercentage.job] = jobPercentage.percentage;
    // });

    // // Create an array to hold the result
    // const result = Object.entries(percentagesByJob).map(([job, percentage]) => ({
    //   job,
    //   percentage,
    // }));

    res.status(200).json({
      status: 'success',
      data: {
        data: jobPercentages,
      },
    });
  }
);
