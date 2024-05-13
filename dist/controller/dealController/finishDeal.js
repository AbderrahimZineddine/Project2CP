"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishDealAccept = exports.finishDealDecline = exports.finishDealRequest = void 0;
const Deal_1 = require("../../models/Deal");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
const Worker_1 = require("../../models/Worker");
exports.finishDealRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.dealRole === UserDoc_1.Role.Worker) {
        req.deal.status = Deal_1.DealStatus.FinishRequestSent;
        req.deal.statusOrd = 1;
    }
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.finishDealDecline = (0, catchAsync_1.default)(async (req, res, next) => {
    req.deal.status = Deal_1.DealStatus.OnGoing;
    req.deal.statusOrd = 2;
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.finishDealAccept = (0, catchAsync_1.default)(async (req, res, next) => {
    req.deal.status = Deal_1.DealStatus.Finished;
    req.deal.statusOrd = 3;
    req.deal._finishedAt = new Date(Date.now());
    // const exp = (req.deal.worker as any).experience + 1;
    // (req.deal.worker as any).save({ validateBeforeSave: false });
    const worker = await Worker_1.Worker.findById(req.deal.worker);
    worker.experience++;
    await worker.save({ validateBeforeSave: false });
    // req.deal._deletedAt = new Date(Date.now());
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=finishDeal.js.map