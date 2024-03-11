"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = void 0;
const User_1 = require("../../models/User");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
const email_1 = __importDefault(require("../../utils/email"));
// export const restrictToCurrentRole = (...roles: string[]) => {
//   //*?  answer : return a function cz express expects that, so we "call" (ex : restrictTo(['user'])) this function, which return a function (a) , then express uses (a) to do whatever it needs; other middlewares are used directly so we don't call them
//   return (req: MyRequest, res: Response, next: NextFunction) => {
//     if (!roles.includes(req.user.currentRole)) {
//       return next(
//         new AppError(
//           'You currently do not have the permission to perform this action',
//           403
//         )
//       );
//     }
//     // user may go to next route :
//     next();
//   };
// };
exports.forgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    //1) get User from POSTed email :
    const user = await User_1.User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError_1.default('There is no user with that email address', 404));
    }
    //2) Generate random token and store the hashed token in user
    const otp = user.createOTP();
    await user.save({ validateBeforeSave: false });
    //3) send the token via email
    try {
        await new email_1.default(user, otp).sendPassswordReset();
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email',
            email: user.email,
        });
    }
    catch (error) {
        user.authentication.otp = undefined;
        user.authentication.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError_1.default('There was an error sending the email. Try again later!', 500));
    }
});
//# sourceMappingURL=forgotPassword.js.map