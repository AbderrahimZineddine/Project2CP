"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealById = exports.getMyDeals = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const Deal_1 = require("../../models/Deal");
const UserDoc_1 = require("../../models/UserDoc");
exports.getMyDeals = (0, catchAsync_1.default)(async (req, res, next) => {
    let deals = [];
    if (req.user.currentRole === UserDoc_1.Role.User) {
        deals = await Deal_1.Deal.find({ user: req.user.id });
    }
    else {
        deals = await Deal_1.Deal.find({ worker: req.user.id });
    }
    res.status(200).json({
        status: 'success',
        deals,
    });
});
exports.getDealById = (0, catchAsync_1.default)(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=getMyDeals.js.map