"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
exports.logout = (0, catchAsync_1.default)(async (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    }); //* setting "loggedout" help in client-side handling  - better then just removing the cookie
    const user = req.user;
    if (req.body.fcmToken) {
        if (user.fcmTokens && user.fcmTokens.includes(req.body.fcmToken)) {
            user.fcmTokens = user.fcmTokens.filter((token) => token != req.body.fcmToken);
            user.save({ validateBeforeSave: false });
        }
    }
    res.status(200).json({ status: 'success' });
});
//# sourceMappingURL=logout.js.map