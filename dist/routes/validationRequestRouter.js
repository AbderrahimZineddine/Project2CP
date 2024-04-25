"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const authController_1 = __importDefault(require("../controller/authController"));
const validationRequestController_1 = __importDefault(require("../controller/validationRequestController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use(authController_1.default.protect, authController_1.default.restrictTo('Admin'));
router.patch('/:id/approveRequest', validationRequestController_1.default.approveValidationRequest);
router.patch('/:id/disapproveRequest', validationRequestController_1.default.disapproveValidationRequest);
router.get('/:id', validationRequestController_1.default.getValidationRequestById);
router.get('/', validationRequestController_1.default.getAllValidationRequests);
exports.default = router;
//# sourceMappingURL=validationRequestRouter.js.map