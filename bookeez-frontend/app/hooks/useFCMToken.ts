import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

interface FcmTokenState {
  fcmToken: string | null;
}

const useFCMToken = () => {
  const [fcmToken, setFcmToken] = useState<FcmTokenState>({ fcmToken: null });

  useEffect(() => {
    const getTokenAndSend = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const currentToken = await getToken(messaging, {
            vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY,
          });
          if (currentToken) {
            setFcmToken({ fcmToken: currentToken });
          } else {
            console.log("No registration token available.");
          }
        } else {
          console.warn("Notification permission denied.");
        }
      } catch (error) {
        console.error("Error while retrieving token: ", error);
      }
    };

    getTokenAndSend();
  }, []);  

  return fcmToken;
};

export default useFCMToken;
