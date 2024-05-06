"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatDate = exports.formatDate2 = exports.getYearlyDocs = exports.getMonthlyDocs = exports.getDailyDocs = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const getDailyDocs = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const DAYS_AGO = 6;
    const startDate = new Date(new Date().setDate(new Date().getDate() - DAYS_AGO));
    const endDate = new Date(Date.now());
    // Initialize objects to store counts for created and deleted docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateKey = (0, exports.formatDate)(date);
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
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[(0, exports.formatDate)(doc.createdAt)].created += 1;
        }
        if (doc._deletedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
            result[(0, exports.formatDate)(doc._deletedAt)].deleted += 1;
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
exports.getDailyDocs = getDailyDocs;
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
const getMonthlyDocs = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const MONTHS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear(), today.getMonth() - MONTHS_AGO + 1, 1);
    const endDate = today;
    // Initialize objects to store counts for created and deleted docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
        const dateKey = (0, exports.formatDate2)(date);
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
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[(0, exports.formatDate2)(doc.createdAt)].created += 1;
        }
        if (doc._deletedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
            result[(0, exports.formatDate2)(doc._deletedAt)].deleted += 1;
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
exports.getMonthlyDocs = getMonthlyDocs;
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
const getYearlyDocs = (Model) => (0, catchAsync_1.default)(async (req, res) => {
    const YEARS_AGO = 6; // Number of months ago
    const today = new Date(); // Today's date
    const startDate = new Date(today.getFullYear() - YEARS_AGO + 1, 1);
    const endDate = today;
    // Initialize objects to store counts for created and deleted docs for each day
    const result = {};
    // Generate all days within the range and initialize counts to zero
    for (let date = new Date(startDate); date <= endDate; date.setFullYear(date.getFullYear() + 1)) {
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
    docs.forEach((doc) => {
        // const dateKey = formatDate(doc._deletedAt || doc.createdAt);
        if (doc.createdAt &&
            doc.createdAt >= startDate &&
            doc.createdAt <= endDate) {
            result[doc.createdAt.getFullYear()].created += 1;
        }
        if (doc._deletedAt &&
            doc._deletedAt >= startDate &&
            doc._deletedAt <= endDate) {
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
exports.getYearlyDocs = getYearlyDocs;
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
const formatDate2 = (date) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        year: '2-digit',
    });
};
exports.formatDate2 = formatDate2;
// Helper function to format date as "MMM DD" (e.g., "Jan 23")
const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
    });
};
exports.formatDate = formatDate;
//# sourceMappingURL=dashboard1model.js.map