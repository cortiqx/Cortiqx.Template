import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export interface UserProfile {
  uid: string;
  email: string;
  role: "admin" | "developer" | "user";
  createdAt: number;
}

export const syncUser = async (user: any): Promise<UserProfile> => {
  if (!user) throw new Error("No user provided");
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }

  // Create new user profile
  let role: UserProfile["role"] = "user";
  
  if (user.email?.endsWith("@cortiqx.com")) {
    role = "developer";
  }

  const newProfile: UserProfile = {
    uid: user.uid,
    email: user.email || "",
    role,
    createdAt: Date.now(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
};

export const getUserRole = async (uid: string): Promise<string> => {
  const userRef = doc(db, "users", uid);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    return userSnap.data().role;
  }
  return "user";
};
