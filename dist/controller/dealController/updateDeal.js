"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDeal = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
exports.updateDeal = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.dealRole === UserDoc_1.Role.Worker) {
        if (req.body.title) {
            req.deal.workerTitle = req.body.title;
        }
        if (req.body.description) {
            req.deal.workerDescription = req.body.description;
        }
    }
    else {
        if (req.body.title) {
            req.deal.userTitle = req.body.title;
        }
        if (req.body.description) {
            req.deal.userDescription = req.body.description;
        }
    }
    await req.deal.save();
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=updateDeal.js.map