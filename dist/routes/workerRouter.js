"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const workerController_1 = __importDefault(require("../controller/workerController"));
const authController_1 = __importDefault(require("../controller/authController"));
const userController_1 = __importDefault(require("../controller/userController"));
const Worker_1 = require("../models/Worker");
const uploadController_1 = __importDefault(require("../controller/uploadController"));
exports.router = express_1.default.Router();
exports.router.get('/me', authController_1.default.protect, authController_1.default.restrictTo('Worker'), userController_1.default.getMe, workerController_1.default.getWorkerById);
exports.router.route('/').get(workerController_1.default.getAllWorkers);
exports.router.get('/:id', authController_1.default.isLoggedIn, workerController_1.default.getWorkerById);
//! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
exports.router.use(authController_1.default.protect);
exports.router.patch('/:id/favorite', userController_1.default.ToggleFavoriteWorker);
exports.router.use(authController_1.default.restrictTo('Worker'));
exports.router.patch('/editMe', 
// userController.upload.single('profilePicture'),
uploadController_1.default.upload.single('profilePicture'), uploadController_1.default.uploadProfilePicture, 
// userController.upload.array('certificates'),
// uploadController.uploadCertificates,
workerController_1.default.editMeWorker, userController_1.default.editMe(Worker_1.Worker));
// router.use(restrictTo('admin')); //TODO add later
// CRUD :
exports.router.route('/').post(workerController_1.default.createWorker);
exports.router
    .route('/:id') //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
    .patch(workerController_1.default.updateWorker)
    .delete(workerController_1.default.deleteWorker);
exports.default = exports.router;
//# sourceMappingURL=workerRouter.js.map