"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const applicationController_1 = __importDefault(require("../controller/applicationController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/me/sent', authController_1.default.protect, authController_1.default.restrictTo('Worker'), applicationController_1.default.getMyApplications, applicationController_1.default.getAllApplications);
router.get('/me/received', authController_1.default.protect, authController_1.default.restrictTo('User'), applicationController_1.default.getMyApplicationsReceived
// applicationController.getAllApplications
);
router.get('/:id', applicationController_1.default.getApplicationById);
router.get('/', applicationController_1.default.getAllApplications);
router.use(authController_1.default.protect);
router.delete('/:id/decline', authController_1.default.restrictTo('User'), applicationController_1.default.checkSentApplication, applicationController_1.default.deleteApplication);
router.use(authController_1.default.restrictTo('Worker'));
router.post('/:id', //here it is post id!!!
applicationController_1.default.ValidateApplicationInputs, applicationController_1.default.applyPost);
router.patch('/:id', applicationController_1.default.checkOwnerApplication, applicationController_1.default.updateApplication);
router.delete('/:id', applicationController_1.default.checkOwnerApplication, applicationController_1.default.deleteApplication);
exports.default = router;
//# sourceMappingURL=applicationRouter.js.map