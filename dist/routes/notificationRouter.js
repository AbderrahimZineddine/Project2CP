"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Notification_1 = require("../models/Notification");
const authController_1 = __importDefault(require("../controller/authController"));
const express_1 = require("express");
const router = (0, express_1.Router)();
router.use(authController_1.default.protect);
router.patch('/:id/viewed', Notification_1.notificationController.checkReceiverNotifications, Notification_1.notificationController.notificationViewed);
router.delete('/:id', authController_1.default.protect, Notification_1.notificationController.checkReceiverNotifications, Notification_1.notificationController.deleteNotificationById);
router.get('/:id', Notification_1.notificationController.getNotificationById);
router.get('/', Notification_1.notificationController.getAllNotifications);
exports.default = router;
//# sourceMappingURL=notificationRouter.js.map