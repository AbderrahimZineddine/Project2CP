import { initializeApp } from 'firebase-admin';
import { applicationDefault } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

var serviceAccount = require('./serv.json');



// export GOOGLE_APPLICATION_CREDENTIALS = "D:\Lenovo\Downloads\easyhome-project2cp-firebase-adminsdk-oypl8-e6a828557a.json"
const firebaseAdmin = initializeApp({
//   credential: admin.credential.cert(serviceAccount),
  credential: applicationDefault(),
  projectId : process.env.PROJECT_ID,
});

export const sendPushNotification = async (
  devicePushToken: string,
  title: string,
  body: string
) => {
  await getMessaging().send({
    token: devicePushToken,
    notification: {
      title,
      body,
    },
  });
};
