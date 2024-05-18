"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBestWorkers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const APIFeatures_1 = __importDefault(require("../../utils/APIFeatures"));
const calculateScore = (worker, globalAverageRating) => {
    const R = worker.rating;
    const N = worker.ratingsNumber;
    const E = worker.experience;
    const K = 5; // Adjust this value based on your preference
    const adjustedRating = (N / (N + K)) * R + (K / (N + K)) * globalAverageRating;
    const score = 0.7 * adjustedRating + 0.3 * Math.log(1 + E);
    return score;
};
exports.getBestWorkers = (0, catchAsync_1.default)(async (req, res, next) => {
    const result = await Worker_1.Worker.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' } } },
    ]);
    const globalAverageRating = result[0] ? result[0].avgRating : 0;
    // const workers: WorkerDoc[] = await Worker.find();
    const features = new APIFeatures_1.default(Worker_1.Worker.find(), req.query)
        .filter()
        .limitFields();
    const workers = await features.query;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;
    let data;
    data = workers.map((worker) => ({
        ...worker.toObject(),
        isFavorite: req.user.favoriteWorkers.includes(worker.id),
        score: calculateScore(worker, globalAverageRating),
    }));
    data.sort((a, b) => {
        if (a.score > b.score) {
            return -1; // a comes before b
        }
        else if (a.score < b.score) {
            return 1; // b comes before a
        }
        else if (!a.isFavorite && b.isFavorite) {
            return 1; // b comes before a
        }
        else if (a.isFavorite && !b.isFavorite) {
            return -1; // a comes before b
        }
        else {
            return 0; // maintain order
        }
    });
    const bestWorkers = data.slice(skip, skip + limit);
    res.status(200).json({
        status: 'success',
        bestWorkers,
    });
});
//# sourceMappingURL=bestWorkers.js.map