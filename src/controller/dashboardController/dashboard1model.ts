import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Response } from 'express';

export const getDailyDocs = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const DAYS_AGO = 6;
    const startDate = new Date(
      new Date().setDate(new Date().getDate() - DAYS_AGO)
    );
    const endDate = new Date(Date.now());

    // Initialize objects to store counts for created and deleted docs for each day
    const result: { [key: string]: { created: number; deleted: number } } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = formatDate(date);
      result[dateKey] = { created: 0, deleted: 0 };
    }

    // Fetch docs created or deleted within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
        { _includeDeleted: true }, // Include deleted documents
      ],
    });

    // Iterate over each doc and update the counts
    docs.forEach((doc: any) => {
      // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
      if (
        doc.createdAt &&
        doc.createdAt >= startDate &&
        doc.createdAt <= endDate
      ) {
        result[formatDate(doc.createdAt)].created += 1;
      }
      if (
        doc._deletedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[formatDate(doc._deletedAt)].deleted += 1;
      }
    });

    // Convert result object to array format
    const dataArray = Object.entries(result).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    res.status(200).json({
      status: 'success',
      data: dataArray,
    });
  });

// Helper function to format date as "MMM DD" (e.g., "Jan 23")
export const getMonthlyDocs = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const MONTHS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth() - MONTHS_AGO + 1,
      1
    );
    const endDate = today;

    // Initialize objects to store counts for created and deleted docs for each day
    const result: { [key: string]: { created: number; deleted: number } } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const dateKey = formatDate2(date);
      result[dateKey] = { created: 0, deleted: 0 };
    }

    // Fetch docs created or deleted within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
        { _includeDeleted: true }, // Include deleted documents
      ],
    });

    // Iterate over each doc and update the counts
    docs.forEach((doc: any) => {
      // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
      if (
        doc.createdAt &&
        doc.createdAt >= startDate &&
        doc.createdAt <= endDate
      ) {
        result[formatDate2(doc.createdAt)].created += 1;
      }
      if (
        doc._deletedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[formatDate2(doc._deletedAt)].deleted += 1;
      }
    });

    // Convert result object to array format
    const dataArray = Object.entries(result).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    res.status(200).json({
      status: 'success',
      data: dataArray,
    });
  });

// Helper function to format date as "MMM DD" (e.g., "Jan 23")
export const getYearlyDocs = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const YEARS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear() - YEARS_AGO + 1, 1);
    const endDate = today;

    // Initialize objects to store counts for created and deleted docs for each day
    const result: { [key: string]: { created: number; deleted: number } } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setFullYear(date.getFullYear() + 1)
    ) {
      result[date.getFullYear()] = { created: 0, deleted: 0 };
    }

    // Fetch docs created or deleted within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
        { _includeDeleted: true }, // Include deleted documents
      ],
    });

    // Iterate over each doc and update the counts
    docs.forEach((doc: any) => {
      // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
      if (
        doc.createdAt &&
        doc.createdAt >= startDate &&
        doc.createdAt <= endDate
      ) {
        result[doc.createdAt.getFullYear()].created += 1;
      }
      if (
        doc._deletedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[doc._deletedAt.getFullYear()].deleted += 1;
      }
    });

    // Convert result object to array format
    const dataArray = Object.entries(result).map(([date, counts]) => ({
      date,
      ...counts,
    }));

    res.status(200).json({
      status: 'success',
      data: dataArray,
    });
  });

// Helper function to format date as "MMM DD" (e.g., "Jan 23")
export const formatDate2 = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    year: '2-digit',
  });
};

// Helper function to format date as "MMM DD" (e.g., "Jan 23")
export const formatDate = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
  });
};
