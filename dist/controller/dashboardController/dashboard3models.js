"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getYearlyDocs3 = exports.getMonthlyDocs3 = exports.getDailyDocs3 = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const dashboard1model_1 = require("./dashboard1model");
const getDailyDocs3 = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const DAYS_AGO = 6;
    const startDate = new Date(new Date().setDate(new Date().getDate() - DAYS_AGO));
    const endDate = new Date(Date.now());
    // Initialize objects to store counts for created and finished docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateKey = (0, dashboard1model_1.formatDate)(date);
        result[dateKey] = { created: 0, finished: 0, canceled: 0 };
    }
    // Fetch docs created or finished within the date range
    const docs = await Model.find({
        $or: [
            { createdAt: { $gte: startDate, $lte: endDate } },
            { _deletedAt: { $gte: startDate, $lte: endDate } },
            { _includeDeleted: true }, // Include deleted documents
        ],
    });
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[(0, dashboard1model_1.formatDate)(doc.createdAt)].created += 1;
        }
        if (doc._finishedAt &&
            doc._finishedAt >= startDate &&
            doc._finishedAt <= endDate) {
            result[(0, dashboard1model_1.formatDate)(doc._finishedAt)].finished += 1;
        }
        if (doc._deletedAt &&
            !doc._finishedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
            result[(0, dashboard1model_1.formatDate)(doc._deletedAt)].canceled += 1;
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
exports.getDailyDocs3 = getDailyDocs3;
const getMonthlyDocs3 = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const MONTHS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear(), today.getMonth() - MONTHS_AGO + 1, 1);
    const endDate = today;
    // Initialize objects to store counts for created and finished docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
        const dateKey = (0, dashboard1model_1.formatDate2)(date);
        result[dateKey] = { created: 0, finished: 0, canceled: 0 };
    }
    // Fetch docs created or finished within the date range
    const docs = await Model.find({
        $or: [
            { createdAt: { $gte: startDate, $lte: endDate } },
            { _deletedAt: { $gte: startDate, $lte: endDate } },
            { _includeDeleted: true }, // Include deleted documents
        ],
    });
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[(0, dashboard1model_1.formatDate2)(doc.createdAt)].created += 1;
        }
        if (doc._finishedAt &&
            doc._finishedAt >= startDate &&
            doc._finishedAt <= endDate) {
            result[(0, dashboard1model_1.formatDate2)(doc._finishedAt)].finished += 1;
        }
        if (doc._deletedAt &&
            !doc._finishedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
            result[(0, dashboard1model_1.formatDate2)(doc._deletedAt)].canceled += 1;
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
exports.getMonthlyDocs3 = getMonthlyDocs3;
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
const getYearlyDocs3 = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const YEARS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear() - YEARS_AGO + 1, 1);
    const endDate = today;
    // Initialize objects to store counts for created and finished docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setFullYear(date.getFullYear() + 1)) {
        result[date.getFullYear()] = { created: 0, finished: 0, canceled: 0 };
    }
    // Fetch docs created or finished within the date range
    const docs = await Model.find({
        $or: [
            { createdAt: { $gte: startDate, $lte: endDate } },
            { _deletedAt: { $gte: startDate, $lte: endDate } },
            { _includeDeleted: true }, // Include deleted documents
        ],
    });
    // const docs2 = await Model2.find({
    //   $or: [{ createdAt: { $gte: startDate, $lte: endDate } }],
    // });
    // Iterate over each doc and update the counts
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[doc.createdAt.getFullYear()].created += 1;
        }
        if (doc._finishedAt &&
            doc._finishedAt >= startDate &&
            doc._finishedAt <= endDate) {
            result[doc._finishedAt.getFullYear()].finished += 1;
        }
        if (doc._deletedAt &&
            !doc._finishedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
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
exports.getYearlyDocs3 = getYearlyDocs3;
//# sourceMappingURL=dashboard3models.js.map