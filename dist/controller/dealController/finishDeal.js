"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.finishDealDecline = exports.finishDealRequest = void 0;
const Deal_1 = require("../../models/Deal");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
exports.finishDealRequest = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.dealRole === UserDoc_1.Role.Worker) {
        req.deal.status = Deal_1.DealStatus.FinishRequestSent;
    }
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
exports.finishDealDecline = (0, catchAsync_1.default)(async (req, res, next) => {
    req.deal.status = Deal_1.DealStatus.OnGoing;
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=finishDeal.js.map