"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const workerController_1 = __importDefault(require("../controller/workerController"));
const authController_1 = __importDefault(require("../controller/authController"));
const userController_1 = __importDefault(require("../controller/userController"));
const Worker_1 = require("../models/Worker");
const uploadController_1 = __importDefault(require("../controller/uploadController"));
const router = express_1.default.Router();
router.use(authController_1.default.protect);
router.patch('/certificates/:id/image', workerController_1.default.checkOwnerCertificate, uploadController_1.default.upload.single('certificate'), uploadController_1.default.uploadCertificate, workerController_1.default.updateCertificateImage);
router.patch('/certificates/:id/title', workerController_1.default.checkOwnerCertificate, workerController_1.default.updateCertificateTitle);
router.get('/certificates/:id', workerController_1.default.getCertificateById);
router.get('/certificates/', workerController_1.default.getMyCertificate);
router.delete('/certificates/:id', workerController_1.default.checkOwnerCertificate, workerController_1.default.deleteCertificateById);
router.post('/certificates', 
// workerController.checkTitle, //* doesn't' work
uploadController_1.default.upload.single('certificate'), uploadController_1.default.uploadCertificate, workerController_1.default.addCertificate);
router.use(authController_1.default.restrictTo('Worker'));
router.route('/').get(workerController_1.default.getAllWorkers);
router.get('/me', userController_1.default.getMe, workerController_1.default.getWorker);
router.patch('/editMe', 
// userController.upload.single('profilePicture'),
uploadController_1.default.upload.single('profilePicture'), uploadController_1.default.uploadProfilePicture, 
// userController.upload.array('certificates'),
// uploadController.uploadCertificates,
workerController_1.default.editMeWorker, userController_1.default.editMe(Worker_1.Worker));
// router.use(restrictTo('admin')); //TODO add later
// CRUD :
router.route('/').post(workerController_1.default.createWorker);
router
    .route('/:id') //! don't repeat that mistake !!!!!!!!!!!!!!!!!!!!!!!!!!!!! ( route(:id)) other routes after are like id ( ex : me ) )
    .get(workerController_1.default.getWorker)
    .patch(workerController_1.default.updateWorker)
    .delete(workerController_1.default.deleteWorker);
exports.default = router;
//# sourceMappingURL=workerRouter.js.map