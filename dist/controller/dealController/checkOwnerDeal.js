"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortMiddleware = exports.checkOwnerDeal = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const Deal_1 = require("../../models/Deal");
const UserDoc_1 = require("../../models/UserDoc");
exports.checkOwnerDeal = (0, catchAsync_1.default)(async (req, res, next) => {
    const deal = await Deal_1.Deal.findById(req.params.id);
    if (!deal) {
        return next(new appError_1.default('No Deal found with that id!', 404));
    }
    console.log(req.user._id);
    console.log(deal.user);
    console.log(deal.worker);
    if (req.user.id === deal.user.toString()) {
        req.dealRole = UserDoc_1.Role.User;
    }
    else if (req.user.id === deal.worker.toString()) {
        req.dealRole = UserDoc_1.Role.Worker;
    }
    else {
        return next(new appError_1.default('You do not have the permission to update this deal!', 404));
    }
    req.deal = deal;
    next();
});
exports.sortMiddleware = (0, catchAsync_1.default)(async (req, res, next) => {
    // Define the priority order for each status
    const statusPriority = {
        [Deal_1.DealStatus.FinishRequestSent]: 1, // Finished request deals
        [Deal_1.DealStatus.OnGoing]: 2, // Ongoing deals
        [Deal_1.DealStatus.Finished]: 3, // Finished deals
    };
    // Set the sort criteria based on status priority
    req.query.sort = `status ${Object.values(statusPriority).join(' ')}`;
    next();
});
//# sourceMappingURL=checkOwnerDeal.js.map