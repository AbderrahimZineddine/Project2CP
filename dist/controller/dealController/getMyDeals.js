"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDealById = exports.getDealsFromWorkerById = exports.getDealsFromUserById = exports.getMyDeals = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const UserDoc_1 = require("../../models/UserDoc");
// export const getMyDeals = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     let deals = [];
//     if (req.user.currentRole === Role.User) {
//       deals = await Deal.find({ user: req.user.id });
//     } else {
//       deals = await Deal.find({ worker: req.user.id });
//     }
//     res.status(200).json({
//       status: 'success',
//       deals,
//     });
//   }
// );
exports.getMyDeals = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.user.currentRole === UserDoc_1.Role.User) {
        req.query.user = req.user.id;
    }
    else {
        req.query.worker = req.user.id;
    }
    next();
});
exports.getDealsFromUserById = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.params.id;
    next();
});
exports.getDealsFromWorkerById = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.worker = req.params.id;
    next();
});
exports.getDealById = (0, catchAsync_1.default)(async (req, res, next) => {
    res.status(200).json({
        status: 'success',
        deal: req.deal,
    });
});
//# sourceMappingURL=getMyDeals.js.map