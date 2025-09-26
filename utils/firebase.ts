import { Platform } from "react-native";

let app: any = null;
let auth: any = null;

if (Platform.OS === "web") {
  // Use Firebase Web SDK for web (modular style)
  import("firebase/app").then((firebase) => {
    import("firebase/auth").then((authModule) => {
      const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_APP_ID,
        measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID,
      };
      if (!firebase.getApps().length) {
        app = firebase.initializeApp(firebaseConfig);
      } else {
        app = firebase.getApp();
      }
      auth = authModule.getAuth(app);
    });
  });
} else {
  // Use React Native Firebase for native
  app = require("@react-native-firebase/app").default;
  auth = require("@react-native-firebase/auth").default;
}

export { app, auth };
