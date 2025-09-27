import React, { createContext, useContext, useEffect, useState } from "react";
import { Platform } from "react-native";
import { auth } from "../utils/firebase";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    displayName?: string
  ) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (displayName: string, photoURL?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuthListener = async () => {
      try {
        const { onAuthStateChanged } = await import("firebase/auth");
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          if (firebaseUser) {
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL,
            });
          } else {
            setUser(null);
          }
          setLoading(false);
        });
      } catch (error) {
        console.error("Firebase auth listener error:", error);
        setLoading(false);
      }
    };

    setupAuthListener();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in");
    }
  };

  const signUp = async (
    email: string,
    password: string,
    displayName?: string
  ) => {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import(
        "firebase/auth"
      );
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (displayName && userCredential.user) {
        await updateProfile(userCredential.user, { displayName });
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to create account");
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (Platform.OS === "web") {
        const { GoogleAuthProvider, signInWithPopup } = await import(
          "firebase/auth"
        );
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        // For React Native with Expo, Google Sign-In requires additional setup
        // This would need proper OAuth configuration with Expo AuthSession
        throw new Error(
          "Google Sign-In on mobile requires additional setup. Please use email/password for now."
        );
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign in with Google");
    }
  };

  const signOut = async () => {
    try {
      const { signOut: firebaseSignOut } = await import("firebase/auth");
      await firebaseSignOut(auth);
    } catch (error: any) {
      throw new Error(error.message || "Failed to sign out");
    }
  };

  const updateProfile = async (displayName: string, photoURL?: string) => {
    try {
      if (!user) throw new Error("No user logged in");

      const { updateProfile: firebaseUpdateProfile } = await import(
        "firebase/auth"
      );
      if (auth.currentUser) {
        await firebaseUpdateProfile(auth.currentUser, {
          displayName,
          photoURL,
        });
      }
    } catch (error: any) {
      throw new Error(error.message || "Failed to update profile");
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
