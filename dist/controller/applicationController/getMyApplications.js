"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyApplications = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
// export const getMyApplications = catchAsync(
//   async (req: MyRequest, res: Response, next: NextFunction) => {
//     const Applications = await Application.find({ worker: req.user.id });
//     res.status(200).json({
//       status: 'success',
//       Applications,
//     });
//   }
// );
exports.getMyApplications = (0, catchAsync_1.default)(async (req, res, next) => {
    req.query.worker = req.user.id;
    next();
});
//# sourceMappingURL=getMyApplications.js.map