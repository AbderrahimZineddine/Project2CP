"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = __importDefault(require("../controller/authController"));
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const router = express_1.default.Router();
//outside app :
router.post('/signup', authController_1.default.signup);
router.post('/verifyEmail', authController_1.default.verifyEmail);
router.post('/login', authController_1.default.login);
router.post('/forgotPassword', authController_1.default.forgotPassword);
router.patch('/resetPassword', authController_1.default.resetPassword);
router.post('/sendVerificationEmail', authController_1.default.sendVerificationEmail);
//in App :
router.use(authController_1.default.protect);
router.get('/logout', authController_1.default.logout);
router.patch('/switch', authController_1.default.switchRole);
router.patch('/updatePassword', authController_1.default.updatePassword);
router.patch('/updateEmail', authController_1.default.updateEmail);
router.post('/signupAsWorker', authController_1.default.restrictTo('User'), authController_1.default.verifyAlreadySignedUp, 
// userController.upload.single('idPicture'),
// userController.upload.array('certificatesImages', 10),
uploadController_1.default.upload.fields([
    {
        name: 'idPicture',
        maxCount: 1,
    },
    {
        name: 'certificatesImages',
        maxCount: 10,
    },
]), uploadController_1.default.uploadId, uploadController_1.default.uploadCertificates, authController_1.default.signupAsWorker);
exports.default = router;
//# sourceMappingURL=authRouter.js.map