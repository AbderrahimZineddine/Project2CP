"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const appError_1 = __importDefault(require("../../utils/appError"));
const multerStorage = multer_1.default.diskStorage({
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default('Not an image! Please upload only images', 400), false);
    }
};
const upload = (0, multer_1.default)({
    storage: multerStorage,
    fileFilter: multerFilter,
});
exports.default = upload;
//# sourceMappingURL=upload.js.map