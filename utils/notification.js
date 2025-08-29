const admin = require("firebase-admin");
const serviceAccount = require("../firebase-key.json"); // download from Firebase

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const sendNotification = (token, title, body) => {
  const message = {
    notification: { title, body },
    token
  };
  return admin.messaging().send(message);
};

module.exports = sendNotification;
