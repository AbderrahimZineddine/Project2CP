"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOwnerPortfolioPost = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const appError_1 = __importDefault(require("../../utils/appError"));
exports.checkOwnerPortfolioPost = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.user.portfolioPosts.find((val) => val.id === req.params.id)) {
        return next(new appError_1.default('This portfolio post not belong to this user', 404));
    }
    next();
});
//# sourceMappingURL=checkOwnerPortfolioPost.js.map