"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPushNotification = void 0;
const messaging_1 = require("firebase-admin/messaging");
// var serviceAccount = require('./serv.json');
// export GOOGLE_APPLICATION_CREDENTIALS = "D:\Lenovo\Downloads\easyhome-project2cp-firebase-adminsdk-oypl8-e6a828557a.json"
// const firebaseAdmin = initializeApp({
// //   credential: admin.credential.cert(serviceAccount),
//   credential: applicationDefault(),
//   projectId : process.env.PROJECT_ID,
// });
const sendPushNotification = async (devicePushToken, title, body) => {
    await (0, messaging_1.getMessaging)().send({
        token: devicePushToken,
        notification: {
            title,
            body,
        },
    });
};
exports.sendPushNotification = sendPushNotification;
//# sourceMappingURL=firebase.js.map