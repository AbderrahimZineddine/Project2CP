"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resizeProfilePicture = exports.uploadProfilePicture = void 0;
const appError_1 = __importDefault(require("../../utils/appError"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multerStorage = multer_1.default.diskStorage({
    // destination: (
    //   _req: Request,
    //   file: Express.Multer.File,
    //   cb: (error: Error | null, destination: string) => void
    // ) => {
    //   cb(null, 'src/public/img/users');
    // },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
// const multerStorage = multer.memoryStorage(); // cz we first need to resize it !
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new appError_1.default('Not an image! Please upload only images', 400), false);
    }
};
const upload = (0, multer_1.default)({ storage: multerStorage, fileFilter: multerFilter }); // if not specified ( call multer() ), stored only in memory
exports.uploadProfilePicture = upload.single('profilePicture');
const resizeProfilePicture = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    //cz we need it later
    // req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
    //width, height : we need  a square, this crops by default !
    // sharp(req.file.buffer)
    //   .resize(500, 500)
    //   .toFormat('jpeg')
    //   .jpeg({ quality: 90 }); //TODO check quality
    // .toFile(`src/public/img/users/${req.file.filename}`);
    // console.log(process.env.API_KEY);
    console.log(req.file);
    cloudinary_1.v2.config({
        api_key: process.env.API_KEY,
        cloud_name: process.env.CLOUD_NAME,
        api_secret: process.env.API_SECRET,
    });
    const result = await cloudinary_1.v2.uploader.upload(req.file.path, {
        transformation: {
            width: 500,
            height: 500,
            crop: 'crop',
            format: 'jpg',
            quality: 90,
        },
    }, function (err, result) {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: err.message,
            });
        }
    });
    // cloudinary.uploader.upload(
    //   req.file.path,
    //   function (result : any) {
    //     console.log(result);
    //   },
    //   { upload_preset: 'ta2ozk9e' }
    // );
    req.user.profilePicture = result.secure_url;
    await req.user.save({ validateBeforeSave: false });
    console.log(result.secure_url);
    next(); // to editMeUser
};
exports.resizeProfilePicture = resizeProfilePicture;
//# sourceMappingURL=multerStorage.js.map