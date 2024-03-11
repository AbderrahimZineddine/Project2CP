"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controller/userController"));
const authController_1 = __importDefault(require("../controller/authController"));
const User_1 = require("../models/User");
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const router = express_1.default.Router();
router.use(authController_1.default.protect);
router.get('/me', userController_1.default.getMe, userController_1.default.getUser);
router.patch('/editMe', authController_1.default.restrictTo('User'), uploadController_1.default.upload.single('profilePicture'), uploadController_1.default.uploadProfilePicture, userController_1.default.editMe(User_1.User));
// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router
    .route('/')
    .get(userController_1.default.getAllUsers)
    .post(userController_1.default.createUser);
router
    .route('/:id')
    .get(userController_1.default.getUser)
    .patch(userController_1.default.updateUser)
    .delete(userController_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=userRouter.js.map