import { MyRequest } from '../userController';
import catchAsync from '../../utils/catchAsync';
import { Response } from 'express';
import { formatDate, formatDate2 } from './dashboard1model';

export const getDailyDocs3 = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const DAYS_AGO = 6;
    const startDate = new Date(
      new Date().setDate(new Date().getDate() - DAYS_AGO)
    );
    const endDate = new Date(Date.now());

    // Initialize objects to store counts for created and finished docs for each day
    const result: {
      [key: string]: { created: number; finished: number; canceled: number };
    } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      const dateKey = formatDate(date);
      result[dateKey] = { created: 0, finished: 0, canceled: 0 };
    }

    // Fetch docs created or finished within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
      ],
    });

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
        doc._finishedAt &&
        doc._finishedAt >= startDate &&
        doc._finishedAt <= endDate
      ) {
        result[formatDate(doc._finishedAt)].finished += 1;
      }
      if (
        doc._deletedAt &&
        !doc._finishedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[formatDate(doc._deletedAt)].canceled += 1;
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

export const getMonthlyDocs3 = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const MONTHS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(
      today.getFullYear(),
      today.getMonth() - MONTHS_AGO + 1,
      1
    );
    const endDate = today;

    // Initialize objects to store counts for created and finished docs for each day
    const result: {
      [key: string]: { created: number; finished: number; canceled: number };
    } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setMonth(date.getMonth() + 1)
    ) {
      const dateKey = formatDate2(date);
      result[dateKey] = { created: 0, finished: 0, canceled: 0 };
    }

    // Fetch docs created or finished within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
      ],
    });

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
        doc._finishedAt &&
        doc._finishedAt >= startDate &&
        doc._finishedAt <= endDate
      ) {
        result[formatDate2(doc._finishedAt)].finished += 1;
      }
      if (
        doc._deletedAt &&
        !doc._finishedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[formatDate2(doc._deletedAt)].canceled += 1;
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
export const getYearlyDocs3 = (Model: any) =>
  catchAsync(async (req: MyRequest, res: Response) => {
    const YEARS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear() - YEARS_AGO + 1, 1);
    const endDate = today;

    // Initialize objects to store counts for created and finished docs for each day
    const result: {
      [key: string]: { created: number; finished: number; canceled: number };
    } = {};

    // Generate all days within the range and initialize counts to zero
    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setFullYear(date.getFullYear() + 1)
    ) {
      result[date.getFullYear()] = { created: 0, finished: 0, canceled: 0 };
    }

    // Fetch docs created or finished within the date range
    const docs = await Model.find({
      $or: [
        { createdAt: { $gte: startDate, $lte: endDate } },
        { _deletedAt: { $gte: startDate, $lte: endDate } },
      ],
    });
    // const docs2 = await Model2.find({
    //   $or: [{ createdAt: { $gte: startDate, $lte: endDate } }],
    // });
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
        doc._finishedAt &&
        doc._finishedAt >= startDate &&
        doc._finishedAt <= endDate
      ) {
        result[doc._finishedAt.getFullYear()].finished += 1;
      }
      if (
        doc._deletedAt &&
        !doc._finishedAt &&
        doc._deletedAt >= startDate &&
        doc._deletedAt <= endDate
      ) {
        result[doc._deletedAt.getFullYear()].canceled += 1;
      }
    });

    // docs2.forEach((doc: any) => {
    //   // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
    //   if (
    //     doc.createdAt &&
    //     doc.createdAt >= startDate &&
    //     doc.createdAt <= endDate
    //   ) {
    //     result[doc.createdAt.getFullYear()].finished += 1;
    //   }
    // });

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
