import admin from "../config/firebase-admin.js";

export const sendPushNotification = async (token, title, message) => {
  try {
    const payload = {
      notification: {
        title,
        body: message,
      },
    };

    // Send notification
    const response = await admin.messaging().send({
      token: token,
      notification: payload.notification,
    });
    console.log("Notification sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending notification:", error);
    throw error;
  }
};
