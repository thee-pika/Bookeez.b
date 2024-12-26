// controllers/notificationController.js
import { sendPushNotification } from "../services/notificationService.js";
import User from "../models/userModel.js";
import express from "express"
const notifyRouter = express.Router();

notifyRouter.post("/send", async (req, res) => {
  try {
    const { userId, title, message } = req.body;

    // Find user by userId and get the FCM token
    const user = await User.findById(userId);
    if (!user || !user.fcmToken) {
      console.log("user", user)
      console.log("fcmtoken", user.fcmToken)
      return res.status(404).json({ message: "User not found or FCM token missing" });
    }

    // Send notification
    const response = await sendPushNotification(user.fcmToken, title, message);

    res.status(200).json({ message: "Notification sent successfully", response, title, message });
  } catch (error) {
    console.error("Error in notifyUser:", error);
    res.status(500).json({ message: "Failed to send notification", error });
  }
})

notifyRouter.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // Find user by userId and get the FCM token
    const user = await User.findById(userId);
    if (!user ) {
      return res.status(404).json({ message: "User not found" });
    }
   const notifications = user.notifications

    res.status(200).json({ message: "Notification rendered successfully", notifications });
  } catch (error) {
    console.error("Error in notifyUser:", error);
    res.status(500).json({ message: "Failed to send notification", error });
  }
})
notifyRouter.delete('/', async (req, res) => {
  try {
    const notifyId = req.query.notifyId; // Correctly access query parameters
    const userId = req.query.userId;

    if (!notifyId || !userId) {
      return res.status(400).json({ message: 'Missing notifyId or userId' });
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   
    user.notifications = user.notifications.filter(
      (notification) => notification._id.toString() !== notifyId
    );

    await user.save();

    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Failed to delete notification', error });
  }
});


export default notifyRouter;
