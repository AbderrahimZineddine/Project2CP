"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToggleFavoriteWorker = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
exports.ToggleFavoriteWorker = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id);
    if (!worker) {
        return next(new appError_1.default('No worker found with that id', 404));
    }
    if (req.user.favoriteWorkers.includes(worker.id)) {
        req.user.favoriteWorkers = req.user.favoriteWorkers.filter((workerId) => workerId != req.params.id);
        await req.user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'worker removed from favorites successfully',
        });
    }
    else {
        req.user.favoriteWorkers.push(worker.id);
        await req.user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: 'success',
            message: 'worker saved as favorite successfully',
        });
    }
});
//# sourceMappingURL=ToggleFavoriteWorker.js.map