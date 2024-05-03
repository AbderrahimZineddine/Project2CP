"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.applicationPerJobPercentage = exports.averageApplicationPerJob = exports.applicationTotal = void 0;
const Application_1 = require("../../models/Application");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.applicationTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalApplications = await Application_1.Application.countDocuments();
    // Find the total number of distinct workers
    const distinctWorkers = await Application_1.Application.distinct('worker');
    // Calculate the average applications per worker
    const averageApplications = totalApplications / distinctWorkers.length;
    res.status(200).json({
        status: 'success',
        data: [
            {
                _id: 'Created',
                count: totalApplications,
            },
            {
                _id: 'Average applications per worker',
                count: averageApplications,
            },
        ],
    });
});
exports.averageApplicationPerJob = (0, catchAsync_1.default)(async (req, res, next) => {
    const applications = await Application_1.Application.find();
    const applicationByJob = applications.reduce((acc, curr) => {
        const job = curr.worker.job;
        if (job) {
            if (!acc[job]) {
                acc[job] = 0;
            }
            acc[job]++;
        }
        return acc;
    }, {});
    const totalJobs = Object.keys(applicationByJob).length;
    const totalApplications = Object.values(applicationByJob).reduce((total, count) => total + count, 0);
    const averageApplicationPerJob = totalApplications / totalJobs;
    res.status(200).json({
        status: 'success',
        data: {
            averageApplicationPerJob: averageApplicationPerJob,
        },
    });
});
exports.applicationPerJobPercentage = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalApplications = await Application_1.Application.countDocuments();
    // Find the total number of distinct workers
    const jobApplications = await Application_1.Application.aggregate([
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
    const jobPercentages = jobApplications.map((jobApp) => ({
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
});
//# sourceMappingURL=applicationDashboard.js.map