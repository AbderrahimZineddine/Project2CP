"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyWorkerReviews = exports.getReviewsFromUserById = exports.getWorkerReviews = exports.getMyReviews = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.getMyReviews = (0, catchAsync_1.default)(async (req, res, next) => {
    // const reviews = await Review.find({ user: req.user.id });
    // res.status(200).json({
    //   status: 'success',
    //   reviews,
    // });
    req.query.user = req.params.id;
    next();
});
exports.getWorkerReviews = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.worker = req.params.id;
    next();
});
exports.getReviewsFromUserById = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.user = req.params.id;
    next();
});
exports.getMyWorkerReviews = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.worker = req.user.id;
    next();
});
// export const getMyWorkerReviews = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     const reviews = await Review.find({ worker: req.user.id });
//     res.status(200).json({
//       status: 'success',
//       reviews,
//     });
//   }
// );
//# sourceMappingURL=getMyReviews.js.map