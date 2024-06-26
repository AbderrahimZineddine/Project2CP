"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.certificateTotal = exports.certificateGeneralDonutChart = void 0;
const Certificate_1 = require("../../models/Certificate");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
exports.certificateGeneralDonutChart = (0, catchAsync_1.default)(async (req, res) => {
    const created = await Certificate_1.Certificate.countDocuments();
    const accepted = await Certificate_1.Certificate.countDocuments({
        _acceptedAt: { $ne: null },
    });
    const deleted = await Certificate_1.Certificate.countDocuments({
        _acceptedAt: { $eq: null },
        _deletedAt: { $ne: null },
    });
    res.status(200).json({
        status: 'success',
        data: [
            {
                _id: 'created',
                count: created,
            },
            {
                _id: 'accepted',
                count: accepted,
            },
            {
                _id: 'deleted',
                count: deleted,
            },
        ],
    });
});
exports.certificateTotal = (0, catchAsync_1.default)(async (req, res, next) => {
    // Count the total number of applications
    const totalWorkers = await Worker_1.Worker.countDocuments();
    const totalCertified = await Worker_1.Worker.countDocuments({
        isCertified: true,
    });
    const percentage = (totalCertified / totalWorkers) * 100;
    res.status(200).json({
        status: 'success',
        data: {
            // {
            //   _id: 'Created',
            //   count: totalWorkers,
            // },
            created: totalWorkers,
            // {
            //   _id: 'Certified Workers',
            //   count: totalCertified,
            // },
            certifiedWorkers: totalCertified,
            // {
            //   _id: 'Not-Certified Workers',
            //   count: totalWorkers - totalCertified,
            // },
            notCertifiedWorkers: totalWorkers - totalCertified,
            // {
            //   _id: 'Certified workers percentage',
            //   count: percentage,
            // },
            certifiedWorkersPercentage: percentage,
        },
    });
});
//# sourceMappingURL=certificateDashboard.js.map