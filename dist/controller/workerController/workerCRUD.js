"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorker = exports.updateWorker = exports.createWorker = exports.getWorkerById = exports.getAllWorkers = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Worker_1 = require("../../models/Worker");
const handlerFactory_1 = require("../handlerFactory");
const UserDoc_1 = require("../../models/UserDoc");
exports.getAllWorkers = (0, handlerFactory_1.getAll)(Worker_1.Worker);
exports.getWorkerById = (0, catchAsync_1.default)(async (req, res, next) => {
    const worker = await Worker_1.Worker.findById(req.params.id);
    if (!worker) {
        return next(new appError_1.default('No worker found with that id', 404));
    }
    if (req.user && req.user.currentRole === UserDoc_1.Role.User) {
        const isFavorite = req.user.favoriteWorkers.includes(worker.id);
        res.status(200).json({
            status: 'success',
            worker,
            isFavorite,
        });
    }
    else {
        res.status(200).json({
            status: 'success',
            worker,
        });
    }
});
exports.createWorker = (0, handlerFactory_1.createOne)(Worker_1.Worker);
exports.updateWorker = (0, handlerFactory_1.updateOne)(Worker_1.Worker);
exports.deleteWorker = (0, handlerFactory_1.deleteOne)(Worker_1.Worker);
//# sourceMappingURL=workerCRUD.js.map